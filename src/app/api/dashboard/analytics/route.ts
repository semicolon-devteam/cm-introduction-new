import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface AnalyticsMetric {
  value: number;
  changePercent?: number;
}

interface AnalyticsResponse {
  connected: boolean;
  metrics?: {
    activeUsers: AnalyticsMetric;
    sessions: AnalyticsMetric;
    bounceRate: AnalyticsMetric;
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30days";
    const propertyId = searchParams.get("propertyId");

    // Google API 인증 정보 확인
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const googleCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    const hasCredentials = (clientEmail && privateKey) || googleCredentials;

    if (!hasCredentials) {
      return NextResponse.json<AnalyticsResponse>({
        connected: false,
        error: "Google API 인증 정보가 설정되지 않았습니다.",
      });
    }

    // propertyId가 없으면 기본 분석 데이터 없음 응답
    if (!propertyId) {
      return NextResponse.json<AnalyticsResponse>({
        connected: false,
        error: "propertyId 파라미터가 필요합니다.",
      });
    }

    try {
      const credentials =
        clientEmail && privateKey
          ? { client_email: clientEmail, private_key: privateKey }
          : JSON.parse(googleCredentials!);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      });

      const analyticsData = google.analyticsdata({ version: "v1beta", auth });

      // 기간 설정
      const days = period === "7days" ? 7 : period === "90days" ? 90 : 30;
      const now = new Date();

      // 현재 기간
      const currentEndDate = new Date(now);
      currentEndDate.setDate(currentEndDate.getDate() - 1);
      const currentStartDate = new Date(currentEndDate);
      currentStartDate.setDate(currentStartDate.getDate() - days);

      // 이전 기간 (비교용)
      const previousEndDate = new Date(currentStartDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);

      // GA4 데이터 가져오기
      const [currentResponse, previousResponse] = await Promise.all([
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [
              {
                startDate: currentStartDate.toISOString().split("T")[0],
                endDate: currentEndDate.toISOString().split("T")[0],
              },
            ],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "bounceRate" }],
          },
        }),
        analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [
              {
                startDate: previousStartDate.toISOString().split("T")[0],
                endDate: previousEndDate.toISOString().split("T")[0],
              },
            ],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "bounceRate" }],
          },
        }),
      ]);

      const currentRow = currentResponse.data.rows?.[0]?.metricValues;
      const previousRow = previousResponse.data.rows?.[0]?.metricValues;

      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      const currentActiveUsers = Number(currentRow?.[0]?.value || 0);
      const currentSessions = Number(currentRow?.[1]?.value || 0);
      const currentBounceRate = Number(currentRow?.[2]?.value || 0) * 100;

      const previousActiveUsers = Number(previousRow?.[0]?.value || 0);
      const previousSessions = Number(previousRow?.[1]?.value || 0);
      const previousBounceRate = Number(previousRow?.[2]?.value || 0) * 100;

      return NextResponse.json<AnalyticsResponse>({
        connected: true,
        metrics: {
          activeUsers: {
            value: currentActiveUsers,
            changePercent: calculateChange(currentActiveUsers, previousActiveUsers),
          },
          sessions: {
            value: currentSessions,
            changePercent: calculateChange(currentSessions, previousSessions),
          },
          bounceRate: {
            value: Math.round(currentBounceRate * 10) / 10,
            changePercent: calculateChange(currentBounceRate, previousBounceRate),
          },
        },
      });
    } catch (apiError) {
      console.error("Analytics API error:", apiError);
      return NextResponse.json<AnalyticsResponse>({
        connected: false,
        error: apiError instanceof Error ? apiError.message : "Analytics API 연결 실패",
      });
    }
  } catch (error) {
    console.error("Analytics route error:", error);
    return NextResponse.json<AnalyticsResponse>(
      {
        connected: false,
        error: error instanceof Error ? error.message : "서버 오류",
      },
      { status: 500 },
    );
  }
}
