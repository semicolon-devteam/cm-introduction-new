import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY가 설정되지 않았습니다. .env.local에 추가해주세요." },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json();
    const { projectId, domain, keywords } = body as {
      projectId: string;
      domain: string;
      keywords: string[];
    };

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ success: false, error: "키워드가 필요합니다." }, { status: 400 });
    }

    const prompt = `당신은 SEO 전문가입니다. 다음 정보를 바탕으로 SEO 최적화 제안을 해주세요.

## 사이트 정보
- 도메인: ${domain}
- 프로젝트 ID: ${projectId}

## 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## 요청사항
다음 형식으로 SEO 최적화 제안을 작성해주세요:

### 1. 메타 태그 최적화
- Title 태그 제안 (60자 이내)
- Meta Description 제안 (155자 이내)

### 2. 키워드 전략
- 주요 키워드 활용 방안
- 롱테일 키워드 제안

### 3. 콘텐츠 최적화
- H1, H2 태그 구조 제안
- 키워드 밀도 권장

### 4. 기술적 SEO
- 구조화 데이터 (JSON-LD) 제안
- URL 구조 개선안

### 5. 즉시 적용 가능한 작업
- 우선순위별 액션 아이템 3-5개

응답은 한국어로 작성하고, 구체적이고 실행 가능한 제안을 해주세요.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const text = chatCompletion.choices[0]?.message?.content || "결과를 생성할 수 없습니다.";

    return NextResponse.json({
      success: true,
      result: text,
    });
  } catch (error) {
    console.error("AI Optimize error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI 최적화 실행 실패",
      },
      { status: 500 },
    );
  }
}
