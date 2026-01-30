import { NextResponse } from "next/server";

/**
 * Google Search Console API 연동
 *
 * 환경 변수 필요:
 * - GOOGLE_CLIENT_EMAIL: Service Account 이메일
 * - GOOGLE_PRIVATE_KEY: Service Account Private Key
 * - SEARCH_CONSOLE_SITE_URL: 등록된 사이트 URL (예: https://example.com 또는 sc-domain:example.com)
 */

interface SearchConsoleMetric {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface DeviceData {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface CountryData {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface DailyData {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleResponse {
  connected: boolean;
  siteUrl?: string;
  period?: { startDate: string; endDate: string };
  overview?: {
    current: SearchConsoleMetric;
    previous: SearchConsoleMetric;
    change: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
  };
  topQueries?: QueryData[];
  topPages?: PageData[];
  deviceBreakdown?: DeviceData[];
  countryBreakdown?: CountryData[];
  dailyData?: DailyData[];
  error?: string;
}

// Google Auth 토큰 가져오기
async function getAccessToken(): Promise<string | null> {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return null;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const base64url = (obj: object) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const unsignedToken = `${base64url(header)}.${base64url(payload)}`;

    const crypto = await import("crypto");
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(unsignedToken);
    const signature = sign
      .sign(privateKey, "base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${unsignedToken}.${signature}`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", await tokenResponse.text());
      return null;
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

// Search Console API 호출
async function fetchSearchAnalytics(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions?: string[],
  rowLimit = 25
): Promise<{ rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }> {
  const body: Record<string, unknown> = {
    startDate,
    endDate,
    rowLimit,
  };

  if (dimensions && dimensions.length > 0) {
    body.dimensions = dimensions;
  }

  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Search Console API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// 날짜 포맷팅 (YYYY-MM-DD)
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// 변화율 계산
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "28days";

  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL;

  // 환경 변수 체크
  if (!siteUrl || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({
      connected: false,
      error: "Search Console 연동 필요: SEARCH_CONSOLE_SITE_URL, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY 환경 변수 설정 필요",
    } as SearchConsoleResponse);
  }

  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        connected: false,
        error: "Google 인증 실패",
      } as SearchConsoleResponse);
    }

    // 기간 계산 (Search Console은 최대 16개월 전 데이터까지)
    const now = new Date();
    // Search Console 데이터는 2-3일 지연됨
    const endDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "7days":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(previousEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "28days":
        startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(previousEndDate.getTime() - 28 * 24 * 60 * 60 * 1000);
        break;
      case "3months":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(previousEndDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(previousEndDate.getTime() - 28 * 24 * 60 * 60 * 1000);
    }

    // 병렬로 데이터 가져오기
    const [currentOverview, previousOverview, topQueries, topPages, deviceData, countryData, dailyData] =
      await Promise.all([
        // 현재 기간 전체 통계
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), undefined, 1),
        // 이전 기간 전체 통계
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(previousStartDate), formatDate(previousEndDate), undefined, 1),
        // 인기 검색어 (Top 25)
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), ["query"], 25),
        // 인기 페이지 (Top 25)
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), ["page"], 25),
        // 기기별 분석
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), ["device"], 10),
        // 국가별 분석
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), ["country"], 10),
        // 일별 데이터
        fetchSearchAnalytics(accessToken, siteUrl, formatDate(startDate), formatDate(endDate), ["date"], 100),
      ]);

    // 현재 기간 통계 파싱
    const currentMetrics: SearchConsoleMetric = currentOverview.rows?.[0]
      ? {
          clicks: currentOverview.rows[0].clicks,
          impressions: currentOverview.rows[0].impressions,
          ctr: Math.round(currentOverview.rows[0].ctr * 10000) / 100,
          position: Math.round(currentOverview.rows[0].position * 10) / 10,
        }
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    // 이전 기간 통계 파싱
    const previousMetrics: SearchConsoleMetric = previousOverview.rows?.[0]
      ? {
          clicks: previousOverview.rows[0].clicks,
          impressions: previousOverview.rows[0].impressions,
          ctr: Math.round(previousOverview.rows[0].ctr * 10000) / 100,
          position: Math.round(previousOverview.rows[0].position * 10) / 10,
        }
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    // 변화율 계산
    const change = {
      clicks: calculateChange(currentMetrics.clicks, previousMetrics.clicks),
      impressions: calculateChange(currentMetrics.impressions, previousMetrics.impressions),
      ctr: calculateChange(currentMetrics.ctr, previousMetrics.ctr),
      position: -calculateChange(currentMetrics.position, previousMetrics.position), // 순위는 낮을수록 좋음
    };

    // 인기 검색어 파싱
    const parsedTopQueries: QueryData[] =
      topQueries.rows?.map((row) => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round(row.ctr * 10000) / 100,
        position: Math.round(row.position * 10) / 10,
      })) || [];

    // 인기 페이지 파싱
    const parsedTopPages: PageData[] =
      topPages.rows?.map((row) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round(row.ctr * 10000) / 100,
        position: Math.round(row.position * 10) / 10,
      })) || [];

    // 기기별 분석 파싱
    const parsedDeviceData: DeviceData[] =
      deviceData.rows?.map((row) => ({
        device: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round(row.ctr * 10000) / 100,
        position: Math.round(row.position * 10) / 10,
      })) || [];

    // 국가별 분석 파싱
    const parsedCountryData: CountryData[] =
      countryData.rows?.map((row) => ({
        country: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: Math.round(row.ctr * 10000) / 100,
        position: Math.round(row.position * 10) / 10,
      })) || [];

    // 일별 데이터 파싱
    const parsedDailyData: DailyData[] =
      dailyData.rows
        ?.map((row) => ({
          date: row.keys[0],
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: Math.round(row.ctr * 10000) / 100,
          position: Math.round(row.position * 10) / 10,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)) || [];

    return NextResponse.json({
      connected: true,
      siteUrl,
      period: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
      overview: {
        current: currentMetrics,
        previous: previousMetrics,
        change,
      },
      topQueries: parsedTopQueries,
      topPages: parsedTopPages,
      deviceBreakdown: parsedDeviceData,
      countryBreakdown: parsedCountryData,
      dailyData: parsedDailyData,
    } as SearchConsoleResponse);
  } catch (error) {
    console.error("Search Console API Error:", error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    } as SearchConsoleResponse);
  }
}
