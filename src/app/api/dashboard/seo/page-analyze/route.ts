import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { parseHTML, analyzeIssues, calculateScore } from "./utils";

export interface SEOIssue {
  type: "error" | "warning" | "info";
  category: "meta" | "content" | "technical" | "image" | "link";
  message: string;
  suggestion: string;
}

export interface PageAnalysisResult {
  url: string;
  score: number;
  issues: SEOIssue[];
  meta: {
    title: string | null;
    titleLength: number;
    description: string | null;
    descriptionLength: number;
    canonical: string | null;
    robots: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  };
  content: {
    h1Count: number;
    h1Text: string[];
    wordCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
    internalLinks: number;
    externalLinks: number;
  };
  technical: {
    isHttps: boolean;
    hasViewport: boolean;
    hasCharset: boolean;
    loadTime?: number;
  };
  aiSuggestions?: string[];
}

export interface PageAnalyzeResponse {
  success: boolean;
  result?: PageAnalysisResult;
  error?: string;
}

// AI 개선 제안 생성
async function generateAISuggestions(
  url: string,
  meta: PageAnalysisResult["meta"],
  issues: SEOIssue[],
): Promise<string[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return [];

  try {
    const groq = new Groq({ apiKey });
    const issuesSummary = issues
      .slice(0, 5)
      .map((i) => `- ${i.message}`)
      .join("\n");

    const prompt = `당신은 SEO 전문가입니다. 다음 페이지 분석 결과를 바탕으로 구체적인 개선 제안 3가지를 제공하세요.

URL: ${url}
현재 제목: ${meta.title || "없음"}
현재 설명: ${meta.description || "없음"}

주요 이슈:
${issuesSummary}

한국어로 간결하고 실행 가능한 제안 3가지를 JSON 배열로만 응답하세요:
["제안1", "제안2", "제안3"]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url: string };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    // URL 가져오기
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOBot/1.0)" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `페이지를 가져올 수 없습니다: ${response.status}` },
        { status: 400 },
      );
    }

    const html = await response.text();
    const parsed = parseHTML(html);

    const meta: PageAnalysisResult["meta"] = {
      title: parsed.title,
      titleLength: parsed.title?.length || 0,
      description: parsed.description,
      descriptionLength: parsed.description?.length || 0,
      canonical: parsed.canonical,
      robots: parsed.robots,
      ogTitle: parsed.ogTitle,
      ogDescription: parsed.ogDescription,
      ogImage: parsed.ogImage,
    };

    const content: PageAnalysisResult["content"] = {
      h1Count: parsed.h1.count,
      h1Text: parsed.h1.texts,
      wordCount: parsed.wordCount,
      imageCount: parsed.images.total,
      imagesWithoutAlt: parsed.images.withoutAlt,
      internalLinks: parsed.links.internal,
      externalLinks: parsed.links.external,
    };

    const technical: PageAnalysisResult["technical"] = {
      isHttps: url.startsWith("https://"),
      hasViewport: parsed.hasViewport,
      hasCharset: parsed.hasCharset,
    };

    const issues = analyzeIssues(meta, content, technical);
    const score = calculateScore(issues);
    const aiSuggestions = await generateAISuggestions(url, meta, issues);

    const result: PageAnalysisResult = {
      url,
      score,
      issues,
      meta,
      content,
      technical,
      aiSuggestions,
    };

    return NextResponse.json({ success: true, result } as PageAnalyzeResponse);
  } catch (error) {
    console.error("Page analyze error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "페이지 분석 실패" },
      { status: 500 },
    );
  }
}
