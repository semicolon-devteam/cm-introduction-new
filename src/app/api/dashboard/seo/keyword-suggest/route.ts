import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard";
  relevance: number; // 1-100
  reason: string;
  type: "related" | "longtail" | "question" | "trending";
}

export interface KeywordSuggestResponse {
  success: boolean;
  suggestions: KeywordSuggestion[];
  analysis: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY가 설정되지 않았습니다.",
        },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json();
    const { domain, keywords, searchConsoleData, analyticsData } = body as {
      domain: string;
      keywords: string[];
      searchConsoleData?: {
        topQueries?: { query: string; clicks: number; impressions: number }[];
      };
      analyticsData?: {
        metrics?: {
          activeUsers?: { value: number; changePercent?: number };
          sessions?: { value: number; changePercent?: number };
          bounceRate?: { value: number; changePercent?: number };
          avgSessionDuration?: { value: number; changePercent?: number };
        };
        topPages?: { path: string; pageViews: number; avgTime: number }[];
        trafficSources?: { source: string; sessions: number; percentage: number }[];
      } | null;
    };

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: "현재 키워드가 필요합니다." },
        { status: 400 },
      );
    }

    // Search Console 데이터에서 추가 컨텍스트 추출
    const scQueries =
      searchConsoleData?.topQueries
        ?.slice(0, 10)
        .map((q) => q.query)
        .join(", ") || "없음";

    // Google Analytics 데이터 포맷팅
    const gaMetricsText = analyticsData?.metrics
      ? `- 활성 사용자: ${analyticsData.metrics.activeUsers?.value || 0}명
- 세션 수: ${analyticsData.metrics.sessions?.value || 0}회
- 이탈률: ${analyticsData.metrics.bounceRate?.value || 0}%
- 평균 체류 시간: ${Math.round((analyticsData.metrics.avgSessionDuration?.value || 0) / 60)}분`
      : "데이터 없음";

    const gaTopPagesText = analyticsData?.topPages?.length
      ? analyticsData.topPages
          .slice(0, 5)
          .map((p) => `- ${p.path}: ${p.pageViews}뷰, 평균 ${Math.round(p.avgTime / 60)}분 체류`)
          .join("\n")
      : "데이터 없음";

    const gaTrafficText = analyticsData?.trafficSources?.length
      ? analyticsData.trafficSources.map((t) => `- ${t.source}: ${t.percentage}%`).join("\n")
      : "데이터 없음";

    const prompt = `당신은 한국 SEO 키워드 전문가입니다. 사용자의 현재 키워드를 분석하고 추가로 타겟팅하면 좋을 키워드를 추천해주세요.

## 사이트 정보
- 도메인: ${domain}

## 현재 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## Search Console에서 유입된 검색어 (참고용)
${scQueries}

## Google Analytics 사이트 현황
### 전체 지표
${gaMetricsText}

### 인기 페이지 (트래픽 많은 페이지)
${gaTopPagesText}

### 트래픽 유입 경로
${gaTrafficText}

## 요청사항
위 키워드와 사이트 데이터를 종합적으로 분석하고 SEO에 도움이 될 새로운 키워드 8-12개를 추천해주세요.
특히 인기 페이지와 이탈률을 참고하여:
- 이탈률이 높으면 검색 의도에 맞는 롱테일 키워드 추천
- 인기 페이지의 주제와 연관된 키워드 추천
- 체류 시간이 긴 콘텐츠의 키워드 확장 추천

다음 JSON 형식으로만 응답하세요:

{
  "analysis": "현재 키워드 분석 및 추천 방향 요약 (2-3문장)",
  "suggestions": [
    {
      "keyword": "추천 키워드",
      "searchVolume": "high|medium|low",
      "difficulty": "easy|medium|hard",
      "relevance": 85,
      "reason": "왜 이 키워드를 추천하는지 간단한 설명",
      "type": "related|longtail|question|trending"
    }
  ]
}

키워드 추천 기준:
1. **related**: 현재 키워드와 직접 연관된 동의어/유사어
2. **longtail**: 구체적인 롱테일 키워드 (예: "정치" → "2024년 대통령 지지율")
3. **question**: 사용자들이 자주 검색하는 질문형 키워드 (예: "OOO는 무엇인가요")
4. **trending**: 최근 이슈/트렌드 관련 키워드

각 타입별로 골고루 추천해주세요.
searchVolume과 difficulty는 한국 검색 시장 기준으로 예상해서 작성하세요.
relevance는 현재 키워드와의 관련성을 1-100으로 표현하세요.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 2048,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    let parsedResponse;
    try {
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      // 파싱 실패 시 기본 응답
      parsedResponse = {
        analysis: "키워드 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        suggestions: [
          {
            keyword: `${keywords[0]} 뜻`,
            searchVolume: "medium",
            difficulty: "easy",
            relevance: 90,
            reason: "정의를 찾는 검색자를 위한 기본 롱테일 키워드",
            type: "longtail",
          },
          {
            keyword: `${keywords[0]} 최신`,
            searchVolume: "medium",
            difficulty: "medium",
            relevance: 85,
            reason: "최신 정보를 찾는 검색자 타겟",
            type: "related",
          },
        ],
      };
    }

    const response: KeywordSuggestResponse = {
      success: true,
      analysis: parsedResponse.analysis,
      suggestions: parsedResponse.suggestions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Keyword suggestion error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "키워드 추천 실패",
      },
      { status: 500 },
    );
  }
}
