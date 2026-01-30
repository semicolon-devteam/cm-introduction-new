import { NextResponse } from "next/server";

/**
 * Meta Business API (Facebook/Instagram Insights) 연동
 *
 * 환경 변수 필요:
 * - META_ACCESS_TOKEN: Meta Business API Access Token
 * - META_PIXEL_ID: Meta Pixel ID
 *
 * API 문서: https://developers.facebook.com/docs/marketing-api/insights
 */

interface MetaMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

interface MetaResponse {
  connected: boolean;
  pixelId?: string;
  metrics?: {
    pageViews: MetaMetric;
    uniqueVisitors: MetaMetric;
    contentViews: MetaMetric;
    addToCart?: MetaMetric;
    purchases?: MetaMetric;
    leads?: MetaMetric;
  };
  trafficSources?: Array<{
    source: string;
    sessions: number;
    percentage: number;
  }>;
  dailyData?: Array<{
    date: string;
    pageViews: number;
    uniqueVisitors: number;
  }>;
  error?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7days";
  const pixelId = searchParams.get("pixelId") || process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  // 환경 변수 체크
  if (!pixelId || !accessToken) {
    return NextResponse.json({
      connected: false,
      error: "Meta 연동 필요: META_PIXEL_ID, META_ACCESS_TOKEN 환경 변수 설정 필요",
      // 데모 데이터
      demo: true,
      metrics: {
        pageViews: { name: "페이지뷰", value: 0, changePercent: 0 },
        uniqueVisitors: { name: "순 방문자", value: 0, changePercent: 0 },
        contentViews: { name: "콘텐츠 조회", value: 0, changePercent: 0 },
      },
      trafficSources: [],
      dailyData: [],
    } as MetaResponse);
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

    // Meta Graph API 호출
    const apiUrl = `https://graph.facebook.com/v18.0/${pixelId}/stats`;
    const params = new URLSearchParams({
      access_token: accessToken,
      start_time: formatDate(startDate),
      end_time: formatDate(now),
      aggregation: "day",
    });

    const response = await fetch(`${apiUrl}?${params}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Meta API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 데이터 파싱 (실제 Meta API 응답 구조에 맞게 조정 필요)
    const metrics: MetaResponse["metrics"] = {
      pageViews: {
        name: "페이지뷰",
        value: data.data?.page_views || 0,
        changePercent: 0,
      },
      uniqueVisitors: {
        name: "순 방문자",
        value: data.data?.unique_visitors || 0,
        changePercent: 0,
      },
      contentViews: {
        name: "콘텐츠 조회",
        value: data.data?.content_views || 0,
        changePercent: 0,
      },
    };

    return NextResponse.json({
      connected: true,
      pixelId,
      metrics,
      trafficSources: [],
      dailyData: [],
    } as MetaResponse);
  } catch (error) {
    console.error("Meta API Error:", error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    } as MetaResponse);
  }
}
