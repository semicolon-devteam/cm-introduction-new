import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export interface CompetitorKeyword {
  keyword: string;
  frequency: number;
  inTitle: boolean;
  inH1: boolean;
  inMeta: boolean;
  importance: "high" | "medium" | "low";
}

export interface CompetitorAnalysisResult {
  url: string;
  domain: string;
  meta: {
    title: string | null;
    description: string | null;
  };
  keywords: CompetitorKeyword[];
  topKeywords: string[];
  contentSummary: {
    wordCount: number;
    h1Count: number;
    h2Count: number;
    imageCount: number;
    linkCount: number;
  };
  aiAnalysis?: {
    strengths: string[];
    opportunities: string[];
    suggestedKeywords: string[];
  };
}

export interface CompetitorAnalyzeResponse {
  success: boolean;
  result?: CompetitorAnalysisResult;
  error?: string;
}

// 텍스트에서 키워드 추출 (한국어 + 영어)
function extractKeywords(text: string): Map<string, number> {
  const keywords = new Map<string, number>();

  // 불용어 목록
  const stopWords = new Set([
    "의",
    "가",
    "이",
    "은",
    "는",
    "를",
    "을",
    "에",
    "에서",
    "로",
    "으로",
    "와",
    "과",
    "도",
    "만",
    "the",
    "a",
    "an",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "shall",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "and",
    "or",
    "but",
    "if",
    "then",
    "else",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "same",
    "so",
    "than",
    "too",
    "very",
  ]);

  // 단어 추출 (한글 2자 이상, 영어 3자 이상)
  const koreanWords = text.match(/[가-힣]{2,}/g) || [];
  const englishWords = text.toLowerCase().match(/[a-z]{3,}/g) || [];

  [...koreanWords, ...englishWords].forEach((word) => {
    if (!stopWords.has(word.toLowerCase())) {
      keywords.set(word, (keywords.get(word) || 0) + 1);
    }
  });

  return keywords;
}

// HTML 파싱
function parseCompetitorHTML(html: string) {
  const getMetaContent = (name: string): string | null => {
    const match =
      html.match(
        new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"),
      ) ||
      html.match(
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, "i"),
      );
    return match?.[1] || null;
  };

  const getTitle = (): string | null => {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match?.[1] || null;
  };

  const getHeadings = (level: number): string[] => {
    const regex = new RegExp(`<h${level}[^>]*>([^<]*(?:<[^/h][^>]*>[^<]*)*)<\/h${level}>`, "gi");
    const matches = html.matchAll(regex);
    const texts: string[] = [];
    for (const match of matches) {
      texts.push(match[1].replace(/<[^>]*>/g, "").trim());
    }
    return texts;
  };

  const getBodyText = (): string => {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (!bodyMatch) return "";
    return bodyMatch[1]
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const countElements = (tag: string): number => {
    const regex = new RegExp(`<${tag}[^>]*>`, "gi");
    return (html.match(regex) || []).length;
  };

  const title = getTitle();
  const description = getMetaContent("description");
  const h1List = getHeadings(1);
  const h2List = getHeadings(2);
  const bodyText = getBodyText();

  return {
    title,
    description,
    h1List,
    h2List,
    bodyText,
    imageCount: countElements("img"),
    linkCount: countElements("a"),
    wordCount: bodyText.split(/\s+/).filter((w) => w.length > 0).length,
  };
}

// AI 분석
async function analyzeWithAI(
  competitorUrl: string,
  competitorTitle: string | null,
  topKeywords: string[],
  myKeywords: string[],
): Promise<CompetitorAnalysisResult["aiAnalysis"] | undefined> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return undefined;

  try {
    const groq = new Groq({ apiKey });

    const prompt = `당신은 SEO 경쟁 분석 전문가입니다. 경쟁사 사이트를 분석하고 인사이트를 제공하세요.

경쟁사 URL: ${competitorUrl}
경쟁사 제목: ${competitorTitle || "없음"}
경쟁사 주요 키워드: ${topKeywords.slice(0, 10).join(", ")}
내 타겟 키워드: ${myKeywords.slice(0, 5).join(", ")}

다음 JSON 형식으로만 응답하세요:
{
  "strengths": ["경쟁사의 강점 1", "경쟁사의 강점 2"],
  "opportunities": ["우리가 공략할 기회 1", "기회 2"],
  "suggestedKeywords": ["추천 키워드 1", "추천 키워드 2", "추천 키워드 3", "추천 키워드 4", "추천 키워드 5"]
}

한국어로 간결하게 응답하세요.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 800,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, myKeywords = [] } = body as {
      url: string;
      myKeywords?: string[];
    };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    // URL 정규화
    let targetUrl = url;
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://${targetUrl}`;
    }

    // 도메인 추출
    const urlObj = new URL(targetUrl);
    const domain = urlObj.hostname;

    // 페이지 가져오기
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `페이지를 가져올 수 없습니다: ${response.status}` },
        { status: 400 },
      );
    }

    const html = await response.text();
    const parsed = parseCompetitorHTML(html);

    // 키워드 추출
    const allText = [
      parsed.title || "",
      parsed.description || "",
      ...parsed.h1List,
      ...parsed.h2List,
      parsed.bodyText,
    ].join(" ");

    const keywordMap = extractKeywords(allText);

    // 상위 키워드 정렬
    const sortedKeywords = Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);

    const keywords: CompetitorKeyword[] = sortedKeywords.map(([keyword, frequency]) => {
      const inTitle = parsed.title?.toLowerCase().includes(keyword.toLowerCase()) || false;
      const inH1 = parsed.h1List.some((h) => h.toLowerCase().includes(keyword.toLowerCase()));
      const inMeta = parsed.description?.toLowerCase().includes(keyword.toLowerCase()) || false;

      let importance: "high" | "medium" | "low" = "low";
      if (inTitle || (inH1 && frequency >= 3)) {
        importance = "high";
      } else if (inH1 || inMeta || frequency >= 5) {
        importance = "medium";
      }

      return {
        keyword,
        frequency,
        inTitle,
        inH1,
        inMeta,
        importance,
      };
    });

    const topKeywords = keywords
      .filter((k) => k.importance === "high" || k.importance === "medium")
      .slice(0, 10)
      .map((k) => k.keyword);

    // AI 분석
    const aiAnalysis = await analyzeWithAI(targetUrl, parsed.title, topKeywords, myKeywords);

    const result: CompetitorAnalysisResult = {
      url: targetUrl,
      domain,
      meta: {
        title: parsed.title,
        description: parsed.description,
      },
      keywords,
      topKeywords,
      contentSummary: {
        wordCount: parsed.wordCount,
        h1Count: parsed.h1List.length,
        h2Count: parsed.h2List.length,
        imageCount: parsed.imageCount,
        linkCount: parsed.linkCount,
      },
      aiAnalysis,
    };

    return NextResponse.json({ success: true, result } as CompetitorAnalyzeResponse);
  } catch (error) {
    console.error("Competitor analyze error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "경쟁사 분석 실패",
      },
      { status: 500 },
    );
  }
}
