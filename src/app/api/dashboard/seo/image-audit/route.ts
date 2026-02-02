import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export interface ImageAuditItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  altQuality: "good" | "poor" | "missing";
  filename: string;
  filenameIssue: boolean;
  suggestedAlt?: string;
  suggestedFilename?: string;
}

export interface ImageAuditResponse {
  success: boolean;
  result?: {
    url: string;
    totalImages: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    poorAltCount: number;
    filenameIssues: number;
    score: number;
    images: ImageAuditItem[];
    aiSuggestions?: string[];
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      url,
      generateAltTags = false,
      keywords = [],
    } = body as {
      url: string;
      generateAltTags?: boolean;
      keywords?: string[];
    };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    // 페이지 가져오기
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

    // 이미지 태그 추출
    const imgRegex = /<img[^>]*>/gi;
    const imgTags = html.match(imgRegex) || [];

    const images: ImageAuditItem[] = imgTags.slice(0, 50).map((tag) => {
      const srcMatch = tag.match(/src=["']([^"']*)["']/i);
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);

      const src = srcMatch?.[1] || "";
      const alt = altMatch?.[1] ?? null;
      const hasAlt = altMatch !== null;

      // 파일명 추출
      const filename = src.split("/").pop()?.split("?")[0] || "";

      // alt 품질 평가
      let altQuality: ImageAuditItem["altQuality"] = "missing";
      if (hasAlt) {
        if (alt && alt.length >= 10 && !alt.match(/^(image|img|photo|picture|\d+)$/i)) {
          altQuality = "good";
        } else {
          altQuality = "poor";
        }
      }

      // 파일명 이슈 체크 (의미없는 파일명)
      const filenameIssue = !filename || /^(IMG_|DSC_|image|photo|\d+)/i.test(filename);

      return {
        src,
        alt,
        hasAlt,
        altQuality,
        filename,
        filenameIssue,
      };
    });

    // 통계 계산
    const totalImages = images.length;
    const imagesWithAlt = images.filter((i) => i.hasAlt).length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const poorAltCount = images.filter((i) => i.altQuality === "poor").length;
    const filenameIssues = images.filter((i) => i.filenameIssue).length;

    // 점수 계산 (100점 만점)
    let score = 100;
    score -= (imagesWithoutAlt / totalImages) * 40; // alt 없음: 최대 -40점
    score -= (poorAltCount / totalImages) * 20; // alt 품질 낮음: 최대 -20점
    score -= (filenameIssues / totalImages) * 20; // 파일명 이슈: 최대 -20점
    score = Math.max(0, Math.round(score));

    // AI alt 태그 생성 (옵션)
    let aiSuggestions: string[] | undefined;
    if (generateAltTags && imagesWithoutAlt > 0) {
      const apiKey = process.env.GROQ_API_KEY;
      if (apiKey) {
        const groq = new Groq({ apiKey });
        const imagesToFix = images.filter((i) => !i.hasAlt || i.altQuality === "poor").slice(0, 5);

        const prompt = `다음 이미지들에 대해 SEO에 최적화된 alt 태그를 제안해주세요.
키워드 컨텍스트: ${keywords.join(", ") || "일반"}

이미지 파일명:
${imagesToFix.map((i, idx) => `${idx + 1}. ${i.filename}`).join("\n")}

각 이미지에 대해 다음 형식으로 응답하세요:
1. 파일명: 제안 alt 텍스트
2. 파일명: 제안 alt 텍스트
...

한국어로 간결하고 설명적인 alt 텍스트를 제안하세요 (10-60자).`;

        try {
          const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500,
          });

          const responseText = completion.choices[0]?.message?.content || "";
          aiSuggestions = responseText.split("\n").filter((line) => line.trim());

          // 이미지에 제안된 alt 할당
          imagesToFix.forEach((img, idx) => {
            const suggestion = aiSuggestions?.[idx];
            if (suggestion) {
              const match = suggestion.match(/:\s*(.+)/);
              if (match) {
                img.suggestedAlt = match[1].trim();
              }
            }
          });
        } catch {
          // AI 실패 시 무시
        }
      }
    }

    // 파일명 제안 생성
    images.forEach((img) => {
      if (img.filenameIssue && keywords.length > 0) {
        const keyword = keywords[0].replace(/\s+/g, "-").toLowerCase();
        img.suggestedFilename = `${keyword}-${img.filename.replace(/^(IMG_|DSC_|\d+)/i, "")}`;
      }
    });

    return NextResponse.json({
      success: true,
      result: {
        url,
        totalImages,
        imagesWithAlt,
        imagesWithoutAlt,
        poorAltCount,
        filenameIssues,
        score,
        images,
        aiSuggestions,
      },
    } as ImageAuditResponse);
  } catch (error) {
    console.error("Image audit error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "이미지 분석 실패" },
      { status: 500 },
    );
  }
}
