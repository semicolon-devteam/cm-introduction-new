import { NextRequest, NextResponse } from "next/server";

export interface TrendData {
  keyword: string;
  period: string;
  ratio: number; // 상대적 검색량 (0-100)
  change: number; // 전주 대비 변화율
}

export interface NaverTrendResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: {
    title: string;
    keywords: string[];
    data: { period: string; ratio: number }[];
  }[];
}

export interface TrendsResponse {
  success: boolean;
  source: "naver" | "mock";
  trends: TrendData[];
  relatedKeywords?: string[];
  error?: string;
}

// 네이버 데이터랩 API 호출
async function fetchNaverTrends(keywords: string[]): Promise<TrendData[] | null> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log("Naver API credentials not configured");
    return null;
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // 최근 30일

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const response = await fetch("https://openapi.naver.com/v1/datalab/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      body: JSON.stringify({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        timeUnit: "week",
        keywordGroups: keywords.slice(0, 5).map((keyword) => ({
          groupName: keyword,
          keywords: [keyword],
        })),
      }),
    });

    if (!response.ok) {
      console.error("Naver API error:", response.status);
      return null;
    }

    const data = (await response.json()) as NaverTrendResponse;

    // 트렌드 데이터 변환
    const trends: TrendData[] = data.results.map((result) => {
      const recentData = result.data.slice(-2); // 최근 2주 데이터
      const currentRatio = recentData[1]?.ratio || 0;
      const previousRatio = recentData[0]?.ratio || 0;
      const change = previousRatio > 0 ? ((currentRatio - previousRatio) / previousRatio) * 100 : 0;

      return {
        keyword: result.title,
        period: recentData[1]?.period || formatDate(endDate),
        ratio: currentRatio,
        change: Math.round(change * 10) / 10,
      };
    });

    return trends;
  } catch (error) {
    console.error("Naver DataLab API error:", error);
    return null;
  }
}

// Google Trends 데이터 (pytrends 서버 필요, 여기서는 mock)
async function fetchGoogleTrends(keywords: string[]): Promise<TrendData[] | null> {
  // Google Trends는 공식 API가 없어서 pytrends 등 별도 서버가 필요
  // 여기서는 간단한 mock 또는 SerpAPI 같은 서비스 연동 가능

  const serpApiKey = process.env.SERPAPI_KEY;

  if (!serpApiKey) {
    return null;
  }

  try {
    // SerpAPI Google Trends 엔드포인트 사용 예시
    const keyword = keywords[0];
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(keyword)}&api_key=${serpApiKey}`,
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // SerpAPI 응답 파싱 (실제 구조에 맞게 수정 필요)
    if (data.interest_over_time?.timeline_data) {
      const timelineData = data.interest_over_time.timeline_data;
      const recent = timelineData.slice(-2);

      return [
        {
          keyword,
          period: recent[1]?.date || new Date().toISOString().split("T")[0],
          ratio: recent[1]?.values?.[0]?.value || 0,
          change: 0,
        },
      ];
    }

    return null;
  } catch (error) {
    console.error("Google Trends API error:", error);
    return null;
  }
}

// Mock 트렌드 데이터 생성 (API 미설정 시 사용)
function generateMockTrends(keywords: string[]): TrendData[] {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  return keywords.slice(0, 10).map((keyword) => {
    // 키워드 특성에 따른 가상 트렌드 생성
    const baseRatio = 30 + Math.random() * 50;
    const change = (Math.random() - 0.5) * 40; // -20% ~ +20%

    return {
      keyword,
      period: now.toISOString().split("T")[0],
      ratio: Math.round(baseRatio),
      change: Math.round(change * 10) / 10,
    };
  });
}

// 연관 키워드 추출 (트렌드 기반)
function getRelatedKeywords(keyword: string): string[] {
  // 실제로는 네이버/구글 API에서 연관 검색어를 가져옴
  // 여기서는 기본적인 패턴 생성
  const patterns = [
    `${keyword} 뜻`,
    `${keyword} 추천`,
    `${keyword} 비교`,
    `${keyword} 가격`,
    `${keyword} 후기`,
    `${keyword} 방법`,
    `${keyword} 순위`,
    `${keyword} 2024`,
  ];

  return patterns.slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords } = body as { keywords: string[] };

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ success: false, error: "키워드가 필요합니다." }, { status: 400 });
    }

    // 1. 네이버 데이터랩 API 시도
    let trends = await fetchNaverTrends(keywords);
    let source: "naver" | "mock" = "naver";

    // 2. 네이버 실패 시 Google Trends 시도
    if (!trends) {
      trends = await fetchGoogleTrends(keywords);
      if (trends) {
        source = "naver"; // SerpAPI도 실제 데이터이므로
      }
    }

    // 3. 둘 다 실패 시 Mock 데이터
    if (!trends) {
      trends = generateMockTrends(keywords);
      source = "mock";
    }

    // 연관 키워드 추출
    const relatedKeywords = keywords.length > 0 ? getRelatedKeywords(keywords[0]) : [];

    const response: TrendsResponse = {
      success: true,
      source,
      trends,
      relatedKeywords,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Trends API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "트렌드 조회 실패",
      },
      { status: 500 },
    );
  }
}

// GET: 인기 검색어 트렌드
export async function GET() {
  try {
    // 네이버 실시간 검색어 또는 인기 키워드 반환
    // 실제로는 네이버 API나 크롤링으로 가져옴

    const popularKeywords = [
      "AI",
      "ChatGPT",
      "주식",
      "부동산",
      "날씨",
      "환율",
      "비트코인",
      "삼성전자",
      "넷플릭스",
      "유튜브",
    ];

    const trends = generateMockTrends(popularKeywords);

    return NextResponse.json({
      success: true,
      source: "mock" as const,
      trends,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Popular trends error:", error);
    return NextResponse.json({ success: false, error: "인기 트렌드 조회 실패" }, { status: 500 });
  }
}
