import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/**
 * 이미지 SEO 진단 결과 타입
 */
export interface ImageAuditItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  altQuality: "good" | "needs_improvement" | "missing";
  width: number | null;
  height: number | null;
  hasExplicitSize: boolean;
  fileType: string | null;
  isOptimized: boolean;
  issues: string[];
  suggestions: string[];
}

export interface ImageAuditResult {
  success: boolean;
  url: string;
  totalImages: number;
  withAlt: number;
  withoutAlt: number;
  score: number;
  images: ImageAuditItem[];
  summary: {
    altCoverage: number;
    optimizedImages: number;
    sizeSpecified: number;
    modernFormats: number;
  };
  aiRecommendations?: string[];
  error?: string;
}

/**
 * URL에서 이미지 추출 및 분석
 */
async function analyzePageImages(url: string): Promise<{
  images: ImageAuditItem[];
  title: string | null;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SEO-ImageAudit/1.0)",
        Accept: "text/html",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();

    // 제목 추출
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // 이미지 태그 추출
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = html.match(imgRegex) || [];

    const images: ImageAuditItem[] = imgTags.map((imgTag) => {
      // src 추출
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      const src = srcMatch ? srcMatch[1] : "";

      // alt 추출
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : null;
      const hasAlt = alt !== null;

      // width/height 추출
      const widthMatch = imgTag.match(/width=["']?(\d+)/i);
      const heightMatch = imgTag.match(/height=["']?(\d+)/i);
      const width = widthMatch ? parseInt(widthMatch[1]) : null;
      const height = heightMatch ? parseInt(heightMatch[1]) : null;
      const hasExplicitSize = width !== null && height !== null;

      // 파일 타입 추출
      const fileTypeMatch = src.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      const fileType = fileTypeMatch ? fileTypeMatch[1].toLowerCase() : null;

      // 최적화 여부 (WebP, AVIF 등)
      const isOptimized = ["webp", "avif", "svg"].includes(fileType || "");

      // alt 품질 평가
      let altQuality: "good" | "needs_improvement" | "missing" = "missing";
      if (alt !== null) {
        if (alt.length === 0) {
          altQuality = "missing";
        } else if (alt.length < 5 || alt.match(/^(image|img|photo|picture|\d+)$/i)) {
          altQuality = "needs_improvement";
        } else {
          altQuality = "good";
        }
      }

      // 이슈 및 제안 생성
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (!hasAlt) {
        issues.push("alt 태그 누락");
        suggestions.push("이미지를 설명하는 alt 텍스트를 추가하세요.");
      } else if (alt?.length === 0) {
        issues.push("alt 태그가 비어 있음");
        suggestions.push("의미 있는 설명을 alt 속성에 추가하세요.");
      } else if (altQuality === "needs_improvement") {
        issues.push("alt 텍스트가 너무 짧거나 일반적임");
        suggestions.push("이미지 내용을 구체적으로 설명하는 텍스트로 변경하세요.");
      }

      if (!hasExplicitSize) {
        issues.push("width/height 미지정");
        suggestions.push("CLS 방지를 위해 이미지 크기를 명시하세요.");
      }

      if (!isOptimized && fileType && ["jpg", "jpeg", "png", "gif"].includes(fileType)) {
        issues.push("비최적화 포맷 사용");
        suggestions.push(`${fileType.toUpperCase()} 대신 WebP 포맷을 사용하세요.`);
      }

      return {
        src,
        alt,
        hasAlt,
        altQuality,
        width,
        height,
        hasExplicitSize,
        fileType,
        isOptimized,
        issues,
        suggestions,
      };
    });

    return { images, title };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * POST /api/dashboard/seo/image-audit
 * 이미지 SEO 진단 실행
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, keywords } = body as { url: string; keywords?: string[] };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    // 이미지 분석
    const { images, title } = await analyzePageImages(normalizedUrl);

    if (images.length === 0) {
      return NextResponse.json({
        success: true,
        url: normalizedUrl,
        totalImages: 0,
        withAlt: 0,
        withoutAlt: 0,
        score: 100,
        images: [],
        summary: {
          altCoverage: 100,
          optimizedImages: 0,
          sizeSpecified: 0,
          modernFormats: 0,
        },
        aiRecommendations: [
          "페이지에 이미지가 없습니다. SEO를 위해 관련 이미지를 추가하는 것을 권장합니다.",
        ],
      });
    }

    // 통계 계산
    const withAlt = images.filter((img) => img.hasAlt && img.alt !== "").length;
    const withoutAlt = images.length - withAlt;
    const optimized = images.filter((img) => img.isOptimized).length;
    const withSize = images.filter((img) => img.hasExplicitSize).length;
    const modernFormats = images.filter((img) =>
      ["webp", "avif", "svg"].includes(img.fileType || ""),
    ).length;

    const summary = {
      altCoverage: Math.round((withAlt / images.length) * 100),
      optimizedImages: optimized,
      sizeSpecified: withSize,
      modernFormats,
    };

    // 점수 계산 (가중치: alt 50%, 크기 명시 20%, 최적화 포맷 30%)
    const score = Math.round(
      summary.altCoverage * 0.5 +
        (withSize / images.length) * 100 * 0.2 +
        (modernFormats / images.length) * 100 * 0.3,
    );

    // AI 추천 생성
    let aiRecommendations: string[] = [];
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && withoutAlt > 0) {
      try {
        const groq = new Groq({ apiKey });

        const prompt = `당신은 이미지 SEO 전문가입니다. 다음 웹페이지의 이미지 SEO 상태를 분석하고 개선 추천을 해주세요.

페이지: ${normalizedUrl}
페이지 제목: ${title || "알 수 없음"}
${keywords ? `타겟 키워드: ${keywords.join(", ")}` : ""}

이미지 통계:
- 총 이미지: ${images.length}개
- alt 태그 있음: ${withAlt}개 (${summary.altCoverage}%)
- alt 태그 없음: ${withoutAlt}개
- 최적화 포맷: ${modernFormats}개
- 크기 명시: ${withSize}개

개선이 필요한 이미지 (최대 3개):
${images
  .filter((img) => img.issues.length > 0)
  .slice(0, 3)
  .map((img) => `- ${img.src.slice(-50)}: ${img.issues.join(", ")}`)
  .join("\n")}

이미지 SEO 개선을 위한 구체적인 추천 3가지를 JSON 배열로 응답해주세요.
예시: ["추천 1", "추천 2", "추천 3"]

한국어로 작성하고, Google 이미지 검색과 네이버 이미지 검색 모두 고려해주세요.`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 512,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        try {
          const cleaned = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          aiRecommendations = JSON.parse(cleaned);
        } catch {
          aiRecommendations = [
            "모든 이미지에 설명적인 alt 태그를 추가하세요.",
            "WebP 포맷으로 이미지를 변환하여 로딩 속도를 개선하세요.",
            "width와 height 속성을 명시하여 CLS(레이아웃 시프트)를 방지하세요.",
          ];
        }
      } catch (e) {
        console.error("AI recommendation failed:", e);
      }
    }

    const result: ImageAuditResult = {
      success: true,
      url: normalizedUrl,
      totalImages: images.length,
      withAlt,
      withoutAlt,
      score,
      images: images.slice(0, 20), // 최대 20개만 반환
      summary,
      aiRecommendations: aiRecommendations.length > 0 ? aiRecommendations : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Image audit error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "이미지 진단 실패" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/dashboard/seo/image-audit
 * 이미지 SEO 가이드
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    guide: {
      alt: {
        title: "Alt 태그 최적화",
        description: "이미지 내용을 설명하는 텍스트",
        tips: [
          "구체적으로 이미지 내용을 설명",
          "키워드를 자연스럽게 포함",
          "50-125자 사이 권장",
          "장식용 이미지는 alt='' 사용",
        ],
      },
      format: {
        title: "이미지 포맷",
        description: "최적의 이미지 포맷 선택",
        recommended: ["WebP (권장)", "AVIF (차세대)", "SVG (아이콘/로고)"],
        avoid: ["BMP", "GIF (애니메이션 외)"],
      },
      size: {
        title: "이미지 크기",
        description: "CLS 방지를 위한 크기 명시",
        tips: ["width, height 속성 명시", "aspect-ratio CSS 사용", "responsive 이미지 사용"],
      },
    },
  });
}
