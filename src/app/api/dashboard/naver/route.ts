import { NextResponse } from "next/server";

/**
 * Naver Search Advisor API 연동
 *
 * 환경 변수 필요:
 * - NAVER_CLIENT_ID: Naver API Client ID
 * - NAVER_CLIENT_SECRET: Naver API Client Secret
 * - NAVER_SITE_ID: Naver Search Advisor Site ID
 *
 * API 문서: https://searchadvisor.naver.com/guide/request-api
 */

interface NaverMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface NaverResponse {
  connected: boolean;
  siteId?: string;
  metrics?: {
    clicks: NaverMetric;
    impressions: NaverMetric;
    ctr: NaverMetric;
    avgPosition: NaverMetric;
  };
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages?: Array<{
    page: string;
    clicks: number;
    impressions: number;
    position: number;
  }>;
  dailyData?: Array<{
    date: string;
    clicks: number;
    impressions: number;
  }>;
  indexStatus?: {
    indexed: number;
    submitted: number;
    errors: number;
  };
  error?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7days";
  const siteId = searchParams.get("siteId") || process.env.NAVER_SITE_ID;
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  // 환경 변수 체크
  if (!siteId || !clientId || !clientSecret) {
    return NextResponse.json({
      connected: false,
      error:
        "Naver 연동 필요: NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_SITE_ID 환경 변수 설정 필요",
      // 데모 데이터
      demo: true,
      metrics: {
        clicks: { name: "클릭수", value: 0, changePercent: 0 },
        impressions: { name: "노출수", value: 0, changePercent: 0 },
        ctr: { name: "CTR", value: 0, changePercent: 0 },
        avgPosition: { name: "평균 순위", value: 0, changePercent: 0 },
      },
      topQueries: [],
      topPages: [],
      dailyData: [],
      indexStatus: { indexed: 0, submitted: 0, errors: 0 },
    } as NaverResponse);
  }

  try {
    // 기간 계산
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Naver Search Advisor API 호출
    // 참고: 실제 API 엔드포인트는 Naver 개발자 문서 확인 필요
    const apiUrl = `https://searchadvisor.naver.com/api/sites/${siteId}/stats`;
    const response = await fetch(apiUrl, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Naver API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 데이터 파싱 (실제 Naver API 응답 구조에 맞게 조정 필요)
    return NextResponse.json({
      connected: true,
      siteId,
      metrics: {
        clicks: {
          name: "클릭수",
          value: data.clicks || 0,
          changePercent: 0,
        },
        impressions: {
          name: "노출수",
          value: data.impressions || 0,
          changePercent: 0,
        },
        ctr: {
          name: "CTR",
          value: data.ctr || 0,
          changePercent: 0,
        },
        avgPosition: {
          name: "평균 순위",
          value: data.position || 0,
          changePercent: 0,
        },
      },
      topQueries: data.queries || [],
      topPages: data.pages || [],
      dailyData: data.daily || [],
      indexStatus: data.indexStatus || { indexed: 0, submitted: 0, errors: 0 },
    } as NaverResponse);
  } catch (error) {
    console.error("Naver API Error:", error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    } as NaverResponse);
  }
}
