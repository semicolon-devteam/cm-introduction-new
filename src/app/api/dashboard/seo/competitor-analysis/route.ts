import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * 경쟁사 분석 결과 타입
 */
export interface CompetitorData {
  url: string;
  domain: string;
  meta: {
    title: string | null;
    description: string | null;
    keywords: string[];
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    canonical: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
  };
  wordCount: number;
  analyzedAt: string;
}

export interface CompetitorAnalysisResult {
  success: boolean;
  myDomain: string;
  competitors: CompetitorData[];
  aiAnalysis?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    keywordGap: {
      competitorOnlyKeywords: string[];
      sharedKeywords: string[];
      myOnlyKeywords: string[];
    };
    recommendations: {
      priority: "high" | "medium" | "low";
      action: string;
      reason: string;
    }[];
    contentComparison: {
      category: string;
      myScore: number;
      avgCompetitorScore: number;
      verdict: "ahead" | "behind" | "even";
    }[];
  };
  error?: string;
}

/**
 * 웹 페이지에서 메타데이터 추출 (서버사이드 스크래핑)
 */
async function scrapeMetadata(url: string): Promise<CompetitorData | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEO-Analyzer/1.0)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const domain = new URL(url).hostname;

    // 정규식으로 메타데이터 추출 (간단한 파싱)
    const getMetaContent = (name: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"),
        new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${name}["']`, "i"),
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
      }
      return null;
    };

    const getTitle = (): string | null => {
      const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      return match ? match[1].trim() : null;
    };

    const getHeadings = (tag: string): string[] => {
      const regex = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "gi");
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(html)) !== null) {
        const text = match[1].trim();
        if (text) matches.push(text);
      }
      return matches.slice(0, 5); // 최대 5개
    };

    const getKeywordsFromMeta = (): string[] => {
      const keywords = getMetaContent("keywords");
      if (!keywords) return [];
      return keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    };

    // 본문 텍스트 추출 (대략적 단어 수)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyText = bodyMatch
      ? bodyMatch[1]
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "";
    const wordCount = bodyText.split(" ").filter((w) => w.length > 0).length;

    const canonical = (() => {
      const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      return match ? match[1] : null;
    })();

    return {
      url,
      domain,
      meta: {
        title: getTitle(),
        description: getMetaContent("description"),
        keywords: getKeywordsFromMeta(),
        ogTitle: getMetaContent("og:title"),
        ogDescription: getMetaContent("og:description"),
        ogImage: getMetaContent("og:image"),
        canonical,
      },
      headings: {
        h1: getHeadings("h1"),
        h2: getHeadings("h2"),
      },
      wordCount,
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

/**
 * POST /api/dashboard/seo/competitor-analysis
 * 경쟁사 분석 실행
 *
 * Body: {
 *   myDomain: string;
 *   myKeywords: string[];
 *   competitorUrls: string[];
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { myDomain, myKeywords, competitorUrls } = body as {
      myDomain: string;
      myKeywords: string[];
      competitorUrls: string[];
    };

    if (!competitorUrls || competitorUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "경쟁사 URL이 필요합니다." },
        { status: 400 },
      );
    }

    if (competitorUrls.length > 5) {
      return NextResponse.json(
        { success: false, error: "최대 5개의 경쟁사만 분석할 수 있습니다." },
        { status: 400 },
      );
    }

    // 경쟁사 웹사이트 스크래핑
    const scrapingPromises = competitorUrls.map((url) => {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      return scrapeMetadata(normalizedUrl);
    });

    const scrapedResults = await Promise.all(scrapingPromises);
    const competitors = scrapedResults.filter((r): r is CompetitorData => r !== null);

    if (competitors.length === 0) {
      return NextResponse.json(
        { success: false, error: "경쟁사 웹사이트를 분석할 수 없습니다." },
        { status: 400 },
      );
    }

    // AI 분석 (Groq API 사용)
    let aiAnalysis;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && myKeywords && myKeywords.length > 0) {
      try {
        const groq = new Groq({ apiKey });

        const competitorSummary = competitors
          .map(
            (c) =>
              `## ${c.domain}
- Title: ${c.meta.title || "없음"}
- Description: ${c.meta.description || "없음"}
- Keywords: ${c.meta.keywords.join(", ") || "없음"}
- H1 태그: ${c.headings.h1.join(", ") || "없음"}
- H2 태그: ${c.headings.h2.slice(0, 5).join(", ") || "없음"}
- 콘텐츠 길이: 약 ${c.wordCount}단어`,
          )
          .join("\n\n");

        const prompt = `당신은 한국 SEO 전문가입니다. 경쟁사 분석 결과를 바탕으로 SEO 전략을 제안해주세요.

## 내 사이트 정보
- 도메인: ${myDomain}
- 타겟 키워드: ${myKeywords.join(", ")}

## 경쟁사 분석 결과
${competitorSummary}

## 요청사항
경쟁사 대비 내 사이트의 SEO 전략을 분석해주세요.

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):

{
  "summary": "전체 경쟁 분석 요약 (2-3문장)",
  "strengths": ["내 사이트의 강점 1", "강점 2"],
  "weaknesses": ["개선이 필요한 점 1", "개선이 필요한 점 2"],
  "opportunities": ["기회 요인 1", "기회 요인 2"],
  "keywordGap": {
    "competitorOnlyKeywords": ["경쟁사만 타겟하는 키워드"],
    "sharedKeywords": ["공통 키워드"],
    "myOnlyKeywords": ["내가 타겟하지만 경쟁사는 안하는 키워드"]
  },
  "recommendations": [
    {
      "priority": "high",
      "action": "구체적인 액션",
      "reason": "이유"
    }
  ],
  "contentComparison": [
    {
      "category": "메타태그 최적화",
      "myScore": 70,
      "avgCompetitorScore": 85,
      "verdict": "behind"
    }
  ]
}

분석 시 고려사항:
1. 경쟁사들의 공통 전략 파악
2. 키워드 갭 분석 (경쟁사가 타겟하지만 내가 놓친 키워드)
3. 콘텐츠 길이 및 구조 비교
4. 메타태그 최적화 수준 비교
5. 한국 SEO (네이버) 관점도 포함`;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 2048,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        try {
          const cleanedResponse = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          aiAnalysis = JSON.parse(cleanedResponse);
        } catch {
          console.error("AI response parsing failed:", responseText);
        }
      } catch (aiError) {
        console.error("AI analysis failed:", aiError);
      }
    }

    const result: CompetitorAnalysisResult = {
      success: true,
      myDomain: myDomain || "unknown",
      competitors,
      aiAnalysis,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Competitor analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "경쟁사 분석 실패",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/dashboard/seo/competitor-analysis
 * 저장된 경쟁사 분석 조회 (LocalStorage에서 관리하므로 기본 정보만 반환)
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "경쟁사 분석은 POST 요청으로 실행해주세요.",
    maxCompetitors: 5,
  });
}
