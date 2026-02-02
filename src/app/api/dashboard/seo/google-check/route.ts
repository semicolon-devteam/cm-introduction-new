import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

import {
  checkHTTPS,
  checkSitemap,
  checkRobots,
  checkCanonical,
  checkStructuredData,
  checkMobileFriendly,
  checkMetaTags,
  checkHeadings,
  checkImageAlt,
  checkPageSpeed,
} from "./utils";

export interface GoogleCheckItem {
  id: string;
  category: "basic" | "technical" | "content" | "mobile" | "structured" | "search-console";
  title: string;
  description: string;
  status: "pass" | "warning" | "fail" | "unknown";
  priority: "high" | "medium" | "low";
  howToFix?: string;
  data?: Record<string, unknown>;
}

export interface SearchConsoleData {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  indexedPages: number;
  crawlErrors: number;
  topQueries: { query: string; clicks: number; impressions: number }[];
}

export interface GoogleCheckResponse {
  success: boolean;
  result?: {
    domain: string;
    score: number;
    items: GoogleCheckItem[];
    recommendations: string[];
    searchConsoleData?: SearchConsoleData;
    analyticsConnected: boolean;
    searchConsoleConnected: boolean;
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body as { domain: string };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    // Search Console API 연동 체크
    let searchConsoleData: SearchConsoleData | undefined;
    let searchConsoleConnected = false;
    const analyticsConnected = false;

    // Google API 인증 정보 확인
    // 방법 1: 개별 환경 변수 (Vercel 권장)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    // 방법 2: 전체 JSON (로컬 개발용)
    const googleCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    const hasCredentials = (clientEmail && privateKey) || googleCredentials;

    if (hasCredentials) {
      try {
        const credentials =
          clientEmail && privateKey
            ? { client_email: clientEmail, private_key: privateKey }
            : JSON.parse(googleCredentials!);

        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: [
            "https://www.googleapis.com/auth/webmasters.readonly",
            "https://www.googleapis.com/auth/analytics.readonly",
          ],
        });
        const searchConsole = google.searchconsole({ version: "v1", auth });

        // Search Console 데이터 가져오기
        const siteUrl = `sc-domain:${cleanDomain}`;
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        try {
          const searchAnalytics = await searchConsole.searchanalytics.query({
            siteUrl,
            requestBody: { startDate, endDate, dimensions: ["query"], rowLimit: 10 },
          });

          if (searchAnalytics.data.rows) {
            searchConsoleConnected = true;
            const rows = searchAnalytics.data.rows;
            let totalClicks = 0;
            let totalImpressions = 0;
            let totalPosition = 0;

            for (const row of rows) {
              totalClicks += row.clicks ?? 0;
              totalImpressions += row.impressions ?? 0;
              totalPosition += row.position ?? 0;
            }

            searchConsoleData = {
              impressions: totalImpressions,
              clicks: totalClicks,
              ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
              position: rows.length > 0 ? totalPosition / rows.length : 0,
              indexedPages: 0,
              crawlErrors: 0,
              topQueries: rows.slice(0, 5).map((r) => ({
                query: r.keys?.[0] ?? "",
                clicks: r.clicks ?? 0,
                impressions: r.impressions ?? 0,
              })),
            };
          }
        } catch {
          // Search Console 접근 실패
        }
      } catch {
        // 인증 실패
      }
    }

    // 병렬로 체크 실행
    const checks = await Promise.all([
      checkHTTPS(cleanDomain),
      checkSitemap(cleanDomain),
      checkRobots(cleanDomain),
      checkCanonical(cleanDomain),
      checkStructuredData(cleanDomain),
      checkMobileFriendly(cleanDomain),
      checkMetaTags(cleanDomain),
      checkHeadings(cleanDomain),
      checkImageAlt(cleanDomain),
      checkPageSpeed(cleanDomain),
    ]);

    const items: GoogleCheckItem[] = [
      ...checks,
      {
        id: "search-console",
        category: "search-console",
        title: "Google Search Console 연동",
        description: searchConsoleConnected
          ? `연동됨 - 최근 28일: ${searchConsoleData?.clicks.toLocaleString()}클릭, ${searchConsoleData?.impressions.toLocaleString()}노출`
          : "Search Console이 연동되지 않았습니다.",
        status: searchConsoleConnected ? "pass" : "warning",
        priority: "high",
        howToFix: searchConsoleConnected
          ? undefined
          : "GOOGLE_SERVICE_ACCOUNT_KEY 환경변수를 설정하세요.",
        data: searchConsoleData as unknown as Record<string, unknown>,
      },
      {
        id: "search-performance",
        category: "search-console",
        title: "검색 성과",
        description: searchConsoleData
          ? `평균 순위: ${searchConsoleData.position.toFixed(1)}위, CTR: ${searchConsoleData.ctr.toFixed(2)}%`
          : "Search Console 연동 후 확인 가능합니다.",
        status: searchConsoleData
          ? searchConsoleData.position <= 10
            ? "pass"
            : searchConsoleData.position <= 30
              ? "warning"
              : "fail"
          : "unknown",
        priority: "high",
        howToFix:
          searchConsoleData && searchConsoleData.position > 10
            ? "콘텐츠 품질 개선과 백링크 확보로 순위를 높이세요."
            : undefined,
      },
      {
        id: "indexing-api",
        category: "technical",
        title: "Indexing API 활용",
        description: "Google Indexing API를 통해 새 콘텐츠를 빠르게 색인할 수 있습니다.",
        status: "unknown",
        priority: "low",
        howToFix: "Indexing API 설정으로 새 페이지 색인 속도 향상",
      },
    ];

    // 점수 계산
    const passCount = items.filter((i) => i.status === "pass").length;
    const totalChecked = items.filter((i) => i.status !== "unknown").length;
    const score = totalChecked > 0 ? Math.round((passCount / totalChecked) * 100) : 0;

    // AI 추천 생성
    const recommendations: string[] = [];
    if (items.some((i) => i.id === "structured-data" && i.status !== "pass")) {
      recommendations.push("JSON-LD 구조화 데이터를 추가하여 리치 스니펫 노출 기회를 높이세요.");
    }
    if (items.some((i) => i.id === "canonical" && i.status !== "pass")) {
      recommendations.push("Canonical 태그를 추가하여 중복 콘텐츠 문제를 방지하세요.");
    }
    if (items.some((i) => i.id === "mobile-friendly" && i.status !== "pass")) {
      recommendations.push(
        "모바일 친화적인 디자인을 적용하세요. Google은 모바일 우선 색인을 사용합니다.",
      );
    }
    if (items.some((i) => i.id === "page-speed" && i.status !== "pass")) {
      recommendations.push(
        "페이지 로딩 속도를 개선하세요. Core Web Vitals는 순위에 영향을 줍니다.",
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        domain: cleanDomain,
        score,
        items,
        recommendations,
        searchConsoleData,
        analyticsConnected,
        searchConsoleConnected,
      },
    } as GoogleCheckResponse);
  } catch (error) {
    console.error("Google check error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Google SEO 체크 실패" },
      { status: 500 },
    );
  }
}
