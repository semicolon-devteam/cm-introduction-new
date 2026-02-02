import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface SearchConsoleMetric {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleResponse {
  connected: boolean;
  overview?: {
    current: SearchConsoleMetric;
    previous: SearchConsoleMetric;
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7days";
    const siteUrl = searchParams.get("siteUrl");

    if (!siteUrl) {
      return NextResponse.json<SearchConsoleResponse>({
        connected: false,
        error: "siteUrl 파라미터가 필요합니다.",
      });
    }

    // Google API 인증 정보 확인
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const googleCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    const hasCredentials = (clientEmail && privateKey) || googleCredentials;

    if (!hasCredentials) {
      return NextResponse.json<SearchConsoleResponse>({
        connected: false,
        error: "Google API 인증 정보가 설정되지 않았습니다.",
      });
    }

    try {
      const credentials =
        clientEmail && privateKey
          ? { client_email: clientEmail, private_key: privateKey }
          : JSON.parse(googleCredentials!);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      });

      const searchConsole = google.searchconsole({ version: "v1", auth });

      // 기간 설정
      const days = period === "30days" ? 30 : period === "90days" ? 90 : 7;
      const now = new Date();

      // 현재 기간
      const currentEndDate = new Date(now);
      currentEndDate.setDate(currentEndDate.getDate() - 2); // API 데이터는 2일 전까지
      const currentStartDate = new Date(currentEndDate);
      currentStartDate.setDate(currentStartDate.getDate() - days);

      // 이전 기간 (비교용)
      const previousEndDate = new Date(currentStartDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - days);

      // 현재 기간 데이터 가져오기
      const currentData = await searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: currentStartDate.toISOString().split("T")[0],
          endDate: currentEndDate.toISOString().split("T")[0],
          dimensions: ["query"],
          rowLimit: 1000,
        },
      });

      // 이전 기간 데이터 가져오기
      const previousData = await searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: previousStartDate.toISOString().split("T")[0],
          endDate: previousEndDate.toISOString().split("T")[0],
          dimensions: ["query"],
          rowLimit: 1000,
        },
      });

      // 집계 함수
      const aggregateMetrics = (rows: typeof currentData.data.rows): SearchConsoleMetric => {
        if (!rows || rows.length === 0) {
          return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
        }

        let totalClicks = 0;
        let totalImpressions = 0;
        let totalPosition = 0;

        for (const row of rows) {
          totalClicks += row.clicks ?? 0;
          totalImpressions += row.impressions ?? 0;
          totalPosition += (row.position ?? 0) * (row.impressions ?? 0);
        }

        return {
          clicks: totalClicks,
          impressions: totalImpressions,
          ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
          position: totalImpressions > 0 ? totalPosition / totalImpressions : 0,
        };
      };

      const current = aggregateMetrics(currentData.data.rows);
      const previous = aggregateMetrics(previousData.data.rows);

      return NextResponse.json<SearchConsoleResponse>({
        connected: true,
        overview: { current, previous },
      });
    } catch (apiError) {
      console.error("Search Console API error:", apiError);
      return NextResponse.json<SearchConsoleResponse>({
        connected: false,
        error: apiError instanceof Error ? apiError.message : "Search Console API 연결 실패",
      });
    }
  } catch (error) {
    console.error("Search Console route error:", error);
    return NextResponse.json<SearchConsoleResponse>(
      {
        connected: false,
        error: error instanceof Error ? error.message : "서버 오류",
      },
      { status: 500 },
    );
  }
}
