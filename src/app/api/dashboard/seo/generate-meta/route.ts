import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json();
    const { url, pageTitle, pageContent, keywords, domain } = body as {
      url: string;
      pageTitle?: string;
      pageContent?: string;
      keywords: string[];
      domain: string;
    };

    if (!url) {
      return NextResponse.json({ success: false, error: "URL이 필요합니다." }, { status: 400 });
    }

    const prompt = `당신은 SEO 전문가입니다. 다음 정보를 바탕으로 최적화된 메타태그를 생성해주세요.

## 페이지 정보
- URL: ${url}
- 도메인: ${domain}
${pageTitle ? `- 현재 제목: ${pageTitle}` : ""}
${pageContent ? `- 페이지 내용 요약: ${pageContent.slice(0, 500)}...` : ""}

## 타겟 키워드
${keywords.length > 0 ? keywords.map((k, i) => `${i + 1}. ${k}`).join("\n") : "키워드 없음"}

## 요청사항
다음 형식의 JSON으로 응답해주세요 (JSON만 출력, 다른 텍스트 없이):

{
  "title": "SEO 최적화된 제목 (60자 이내)",
  "description": "SEO 최적화된 설명 (155자 이내)",
  "ogTitle": "Open Graph 제목",
  "ogDescription": "Open Graph 설명",
  "ogType": "website 또는 article",
  "twitterCard": "summary_large_image",
  "canonicalUrl": "${url}",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}

주의사항:
- 한국어로 작성
- 키워드를 자연스럽게 포함
- 클릭을 유도하는 매력적인 문구 사용
- JSON 형식만 출력 (마크다운 코드블록 없이)`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    // JSON 파싱 시도
    let metaTags;
    try {
      // 마크다운 코드블록 제거
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      metaTags = JSON.parse(cleanedResponse);
    } catch {
      // JSON 파싱 실패 시 기본값 반환
      metaTags = {
        title: `${domain} - ${keywords[0] || "홈"}`,
        description: `${domain}에서 ${keywords.join(", ")} 관련 정보를 확인하세요.`,
        ogTitle: `${domain} - ${keywords[0] || "홈"}`,
        ogDescription: `${domain}에서 ${keywords.join(", ")} 관련 정보를 확인하세요.`,
        ogType: "website",
        twitterCard: "summary_large_image",
        canonicalUrl: url,
        keywords: keywords,
        parseError: true,
        rawResponse: responseText,
      };
    }

    // HTML 코드 생성
    const htmlCode = `<!-- SEO Meta Tags -->
<title>${metaTags.title}</title>
<meta name="description" content="${metaTags.description}" />
<meta name="keywords" content="${(metaTags.keywords || keywords).join(", ")}" />
<link rel="canonical" href="${metaTags.canonicalUrl || url}" />

<!-- Open Graph -->
<meta property="og:title" content="${metaTags.ogTitle}" />
<meta property="og:description" content="${metaTags.ogDescription}" />
<meta property="og:type" content="${metaTags.ogType || "website"}" />
<meta property="og:url" content="${metaTags.canonicalUrl || url}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="${metaTags.twitterCard || "summary_large_image"}" />
<meta name="twitter:title" content="${metaTags.ogTitle}" />
<meta name="twitter:description" content="${metaTags.ogDescription}" />`;

    return NextResponse.json({
      success: true,
      metaTags,
      htmlCode,
    });
  } catch (error) {
    console.error("Meta generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "메타태그 생성 실패",
      },
      { status: 500 },
    );
  }
}
