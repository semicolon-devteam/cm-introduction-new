import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// 새 글 발행 시 자동으로 호출되는 웹훅
// CMS나 블로그 시스템에서 새 글 발행 시 이 엔드포인트를 호출

const INDEXNOW_ENDPOINTS = {
  naver: "https://searchadvisor.naver.com/indexnow",
  bing: "https://www.bing.com/indexnow",
};

export async function POST(request: NextRequest) {
  try {
    // Webhook 인증 (선택적)
    const authHeader = request.headers.get("x-webhook-secret");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret && authHeader !== webhookSecret) {
      return NextResponse.json({ success: false, error: "인증 실패" }, { status: 401 });
    }

    const body = await request.json();
    const {
      url,
      title,
      content,
      host,
      projectId,
      keywords = [],
      autoIndexNow = true,
      autoMetaTags = true,
    } = body as {
      url: string;
      title?: string;
      content?: string;
      host: string;
      projectId?: string;
      keywords?: string[];
      autoIndexNow?: boolean;
      autoMetaTags?: boolean;
    };

    if (!url || !host) {
      return NextResponse.json(
        { success: false, error: "URL과 호스트가 필요합니다." },
        { status: 400 },
      );
    }

    const results: {
      action: string;
      success: boolean;
      data?: unknown;
      error?: string;
    }[] = [];

    // 1. IndexNow 자동 제출
    if (autoIndexNow) {
      const indexNowKey = process.env.INDEXNOW_KEY;

      if (indexNowKey) {
        const payload = {
          host,
          key: indexNowKey,
          keyLocation: `https://${host}/${indexNowKey}.txt`,
          urlList: [url],
        };

        for (const [engine, endpoint] of Object.entries(INDEXNOW_ENDPOINTS)) {
          try {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json; charset=utf-8" },
              body: JSON.stringify(payload),
            });

            results.push({
              action: `indexnow_${engine}`,
              success: response.ok || response.status === 202,
              data: { status: response.status },
            });
          } catch (error) {
            results.push({
              action: `indexnow_${engine}`,
              success: false,
              error: error instanceof Error ? error.message : "요청 실패",
            });
          }
        }
      } else {
        results.push({
          action: "indexnow",
          success: false,
          error: "INDEXNOW_KEY 미설정",
        });
      }
    }

    // 2. AI 메타태그 자동 생성
    if (autoMetaTags && keywords.length > 0) {
      const apiKey = process.env.GROQ_API_KEY;

      if (apiKey) {
        try {
          const groq = new Groq({ apiKey });

          const prompt = `당신은 SEO 전문가입니다. 다음 정보를 바탕으로 최적화된 메타태그를 생성해주세요.

## 페이지 정보
- URL: ${url}
- 도메인: ${host}
${title ? `- 제목: ${title}` : ""}
${content ? `- 내용 요약: ${content.slice(0, 500)}...` : ""}

## 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## 요청사항
다음 형식의 JSON으로 응답해주세요 (JSON만 출력):

{
  "title": "SEO 최적화된 제목 (60자 이내)",
  "description": "SEO 최적화된 설명 (155자 이내)",
  "ogTitle": "Open Graph 제목",
  "ogDescription": "Open Graph 설명",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}`;

          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 512,
          });

          const responseText = chatCompletion.choices[0]?.message?.content || "";

          try {
            const cleanedResponse = responseText
              .replace(/```json\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
            const metaTags = JSON.parse(cleanedResponse);

            results.push({
              action: "meta_tags",
              success: true,
              data: metaTags,
            });
          } catch {
            results.push({
              action: "meta_tags",
              success: false,
              error: "메타태그 파싱 실패",
            });
          }
        } catch (error) {
          results.push({
            action: "meta_tags",
            success: false,
            error: error instanceof Error ? error.message : "AI 생성 실패",
          });
        }
      }
    }

    // 3. 로그 기록 (실제 구현에서는 DB에 저장)
    const logEntry = {
      timestamp: new Date().toISOString(),
      url,
      host,
      projectId,
      results,
    };

    console.log("[SEO Webhook]", JSON.stringify(logEntry, null, 2));

    return NextResponse.json({
      success: true,
      message: "웹훅 처리 완료",
      url,
      results,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "웹훅 처리 실패",
      },
      { status: 500 },
    );
  }
}

// GET: 웹훅 상태 및 사용법 안내
export async function GET() {
  return NextResponse.json({
    status: "active",
    usage: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": "선택적 인증 (WEBHOOK_SECRET 환경변수 설정 시)",
      },
      body: {
        url: "필수 - 새 글 URL",
        host: "필수 - 도메인 (예: example.com)",
        title: "선택 - 글 제목",
        content: "선택 - 글 내용 (메타태그 생성용)",
        projectId: "선택 - 프로젝트 ID",
        keywords: "선택 - 타겟 키워드 배열",
        autoIndexNow: "선택 - IndexNow 자동 제출 (기본: true)",
        autoMetaTags: "선택 - 메타태그 자동 생성 (기본: true)",
      },
    },
    example: {
      url: "https://example.com/blog/new-post",
      host: "example.com",
      title: "새 블로그 글 제목",
      content: "글 내용의 일부...",
      keywords: ["키워드1", "키워드2"],
      autoIndexNow: true,
      autoMetaTags: true,
    },
  });
}
