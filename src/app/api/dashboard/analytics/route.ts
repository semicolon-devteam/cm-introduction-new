import { NextResponse } from "next/server";

/**
 * Google Analytics 4 Data API 연동
 *
 * 환경 변수 필요:
 * - GA_PROPERTY_ID: GA4 Property ID (예: 123456789)
 * - GOOGLE_CLIENT_EMAIL: Service Account 이메일
 * - GOOGLE_PRIVATE_KEY: Service Account Private Key
 */

interface GAMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface GAResponse {
  connected: boolean;
  propertyId?: string;
  metrics?: {
    activeUsers: GAMetric;
    sessions: GAMetric;
    pageViews: GAMetric;
    bounceRate: GAMetric;
    avgSessionDuration: GAMetric;
    newUsers: GAMetric;
  };
  topPages?: Array<{
    path: string;
    pageViews: number;
    avgTime: number;
  }>;
  trafficSources?: Array<{
    source: string;
    sessions: number;
    percentage: number;
  }>;
  dailyData?: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
  }>;
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
    // JWT 생성
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    // Base64url 인코딩
    const base64url = (obj: object) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const unsignedToken = `${base64url(header)}.${base64url(payload)}`;

    // crypto 모듈로 서명 (Node.js)
    const crypto = await import("crypto");
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(unsignedToken);
    const signature = sign
      .sign(privateKey, "base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${unsignedToken}.${signature}`;

    // 토큰 교환
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

// GA4 Data API 호출
async function fetchGAData(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string,
  metrics: string[],
  dimensions?: string[]
): Promise<any> {
  const body: any = {
    dateRanges: [{ startDate, endDate }],
    metrics: metrics.map((name) => ({ name })),
  };

  if (dimensions && dimensions.length > 0) {
    body.dimensions = dimensions.map((name) => ({ name }));
  }

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
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
    throw new Error(`GA API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// 날짜 포맷팅 (YYYY-MM-DD)
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7days";

  const propertyId = process.env.GA_PROPERTY_ID;

  // 환경 변수 체크
  if (!propertyId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    // Demo 데이터 반환 (GA 미연동 시)
    return NextResponse.json({
      connected: false,
      error: "GA 연동 필요: GA_PROPERTY_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY 환경 변수 설정 필요",
      // 데모 데이터 (테스트용)
      demo: true,
      metrics: {
        activeUsers: { name: "활성 사용자", value: 0, previousValue: 0, changePercent: 0 },
        sessions: { name: "세션", value: 0, previousValue: 0, changePercent: 0 },
        pageViews: { name: "페이지뷰", value: 0, previousValue: 0, changePercent: 0 },
        bounceRate: { name: "이탈률", value: 0, previousValue: 0, changePercent: 0 },
        avgSessionDuration: { name: "평균 세션 시간", value: 0, previousValue: 0, changePercent: 0 },
        newUsers: { name: "신규 사용자", value: 0, previousValue: 0, changePercent: 0 },
      },
      topPages: [],
      trafficSources: [],
      dailyData: [],
    } as GAResponse);
  }

  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        connected: false,
        error: "Google 인증 실패",
      } as GAResponse);
    }

    // 기간 계산
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (period) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 91 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
    }

    // 현재 기간 메트릭
    const currentMetrics = await fetchGAData(
      accessToken,
      propertyId,
      formatDate(startDate),
      formatDate(now),
      [
        "activeUsers",
        "sessions",
        "screenPageViews",
        "bounceRate",
        "averageSessionDuration",
        "newUsers",
      ]
    );

    // 이전 기간 메트릭 (비교용)
    const previousMetrics = await fetchGAData(
      accessToken,
      propertyId,
      formatDate(previousStartDate),
      formatDate(previousEndDate),
      [
        "activeUsers",
        "sessions",
        "screenPageViews",
        "bounceRate",
        "averageSessionDuration",
        "newUsers",
      ]
    );

    // 인기 페이지
    const topPagesData = await fetchGAData(
      accessToken,
      propertyId,
      formatDate(startDate),
      formatDate(now),
      ["screenPageViews", "averageSessionDuration"],
      ["pagePath"]
    );

    // 트래픽 소스
    const trafficData = await fetchGAData(
      accessToken,
      propertyId,
      formatDate(startDate),
      formatDate(now),
      ["sessions"],
      ["sessionSource"]
    );

    // 일별 데이터
    const dailyData = await fetchGAData(
      accessToken,
      propertyId,
      formatDate(startDate),
      formatDate(now),
      ["activeUsers", "sessions", "screenPageViews"],
      ["date"]
    );

    // 데이터 파싱
    const parseValue = (row: any, index: number) =>
      row?.metricValues?.[index]?.value ? Number(row.metricValues[index].value) : 0;

    const currentRow = currentMetrics.rows?.[0];
    const previousRow = previousMetrics.rows?.[0];

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return { change: current, changePercent: current > 0 ? 100 : 0 };
      const change = current - previous;
      const changePercent = Math.round((change / previous) * 100);
      return { change, changePercent };
    };

    const metrics = {
      activeUsers: {
        name: "활성 사용자",
        value: parseValue(currentRow, 0),
        previousValue: parseValue(previousRow, 0),
        ...calculateChange(parseValue(currentRow, 0), parseValue(previousRow, 0)),
      },
      sessions: {
        name: "세션",
        value: parseValue(currentRow, 1),
        previousValue: parseValue(previousRow, 1),
        ...calculateChange(parseValue(currentRow, 1), parseValue(previousRow, 1)),
      },
      pageViews: {
        name: "페이지뷰",
        value: parseValue(currentRow, 2),
        previousValue: parseValue(previousRow, 2),
        ...calculateChange(parseValue(currentRow, 2), parseValue(previousRow, 2)),
      },
      bounceRate: {
        name: "이탈률",
        value: Math.round(parseValue(currentRow, 3) * 100),
        previousValue: Math.round(parseValue(previousRow, 3) * 100),
        ...calculateChange(
          Math.round(parseValue(currentRow, 3) * 100),
          Math.round(parseValue(previousRow, 3) * 100)
        ),
      },
      avgSessionDuration: {
        name: "평균 세션 시간",
        value: Math.round(parseValue(currentRow, 4)),
        previousValue: Math.round(parseValue(previousRow, 4)),
        ...calculateChange(
          Math.round(parseValue(currentRow, 4)),
          Math.round(parseValue(previousRow, 4))
        ),
      },
      newUsers: {
        name: "신규 사용자",
        value: parseValue(currentRow, 5),
        previousValue: parseValue(previousRow, 5),
        ...calculateChange(parseValue(currentRow, 5), parseValue(previousRow, 5)),
      },
    };

    // 인기 페이지 파싱
    const totalSessions = metrics.sessions.value || 1;
    const topPages =
      topPagesData.rows
        ?.slice(0, 10)
        .map((row: any) => ({
          path: row.dimensionValues?.[0]?.value || "/",
          pageViews: Number(row.metricValues?.[0]?.value || 0),
          avgTime: Math.round(Number(row.metricValues?.[1]?.value || 0)),
        })) || [];

    // 트래픽 소스 파싱
    const trafficSources =
      trafficData.rows
        ?.slice(0, 5)
        .map((row: any) => {
          const sessions = Number(row.metricValues?.[0]?.value || 0);
          return {
            source: row.dimensionValues?.[0]?.value || "direct",
            sessions,
            percentage: Math.round((sessions / totalSessions) * 100),
          };
        }) || [];

    // 일별 데이터 파싱
    const dailyParsed =
      dailyData.rows?.map((row: any) => ({
        date: row.dimensionValues?.[0]?.value || "",
        activeUsers: Number(row.metricValues?.[0]?.value || 0),
        sessions: Number(row.metricValues?.[1]?.value || 0),
        pageViews: Number(row.metricValues?.[2]?.value || 0),
      })) || [];

    return NextResponse.json({
      connected: true,
      propertyId,
      metrics,
      topPages,
      trafficSources,
      dailyData: dailyParsed.sort((a: any, b: any) => a.date.localeCompare(b.date)),
    } as GAResponse);
  } catch (error) {
    console.error("GA API Error:", error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    } as GAResponse);
  }
}
