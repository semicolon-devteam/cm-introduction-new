import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export interface WeeklyAction {
  id: string;
  title: string;
  description: string;
  category: "content" | "technical" | "link" | "image" | "meta";
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  estimatedTime: string;
  aiTip?: string;
}

export interface WeeklyActionsResponse {
  success: boolean;
  actions?: WeeklyAction[];
  summary?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, keywords, seoIssues, currentScore } = body as {
      domain: string;
      keywords: string[];
      seoIssues?: { type: string; message: string }[];
      currentScore?: number;
    };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // API 키 없으면 기본 액션 반환
      return NextResponse.json({
        success: true,
        actions: getDefaultActions(keywords, seoIssues),
        summary: "기본 SEO 개선 액션을 생성했습니다.",
      });
    }

    const groq = new Groq({ apiKey });

    const issuesSummary =
      seoIssues
        ?.slice(0, 5)
        .map((i) => `- ${i.message}`)
        .join("\n") || "분석된 이슈 없음";
    const keywordsList = keywords.slice(0, 5).join(", ") || "등록된 키워드 없음";

    const prompt = `당신은 SEO 전문가입니다. 다음 사이트에 대해 이번 주에 실행해야 할 구체적인 SEO 액션 5가지를 추천해주세요.

도메인: ${domain}
타겟 키워드: ${keywordsList}
현재 SEO 점수: ${currentScore || "미측정"}
발견된 이슈:
${issuesSummary}

다음 JSON 형식으로만 응답하세요:
{
  "summary": "이번 주 SEO 개선 방향 요약 (1-2문장)",
  "actions": [
    {
      "id": "action-1",
      "title": "구체적인 액션 제목",
      "description": "상세 설명 및 실행 방법",
      "category": "content|technical|link|image|meta 중 하나",
      "priority": "high|medium|low 중 하나",
      "estimatedTime": "예상 소요 시간 (예: 30분, 1시간)",
      "aiTip": "추가 팁이나 예시"
    }
  ]
}

한국어로 응답하고, 구체적이고 실행 가능한 액션을 제안하세요.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      const actions = (parsed.actions || []).map((a: WeeklyAction) => ({
        ...a,
        status: "pending" as const,
      }));

      return NextResponse.json({
        success: true,
        actions,
        summary: parsed.summary || "AI가 이번 주 SEO 액션을 생성했습니다.",
      } as WeeklyActionsResponse);
    } catch {
      return NextResponse.json({
        success: true,
        actions: getDefaultActions(keywords, seoIssues),
        summary: "기본 SEO 개선 액션을 생성했습니다.",
      });
    }
  } catch (error) {
    console.error("Weekly actions error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "주간 액션 생성 실패" },
      { status: 500 },
    );
  }
}

function getDefaultActions(
  keywords: string[],
  seoIssues?: { type: string; message: string }[],
): WeeklyAction[] {
  const actions: WeeklyAction[] = [];
  const keyword = keywords[0] || "메인 키워드";

  // 이슈 기반 액션
  if (seoIssues?.some((i) => i.message.includes("alt"))) {
    actions.push({
      id: "action-img",
      title: "이미지 alt 태그 추가",
      description: "alt 속성이 없는 이미지에 설명적인 대체 텍스트를 추가하세요.",
      category: "image",
      priority: "high",
      status: "pending",
      estimatedTime: "30분",
      aiTip: `"${keyword}" 키워드를 자연스럽게 포함시키세요.`,
    });
  }

  if (seoIssues?.some((i) => i.message.includes("내부 링크"))) {
    actions.push({
      id: "action-link",
      title: "내부 링크 구조 개선",
      description: "관련 페이지들 간의 내부 링크를 추가하여 사이트 구조를 강화하세요.",
      category: "link",
      priority: "medium",
      status: "pending",
      estimatedTime: "1시간",
    });
  }

  // 기본 액션 추가
  if (actions.length < 3) {
    actions.push({
      id: "action-content",
      title: `"${keyword}" 관련 콘텐츠 작성`,
      description: `타겟 키워드 "${keyword}"를 포함한 1,000자 이상의 고품질 콘텐츠를 작성하세요.`,
      category: "content",
      priority: "high",
      status: "pending",
      estimatedTime: "2시간",
      aiTip: "제목, H2 태그, 첫 단락에 키워드를 자연스럽게 배치하세요.",
    });
  }

  if (actions.length < 4) {
    actions.push({
      id: "action-meta",
      title: "메타 태그 최적화",
      description: "페이지별 고유한 title과 description 메타 태그를 작성하세요.",
      category: "meta",
      priority: "medium",
      status: "pending",
      estimatedTime: "30분",
    });
  }

  if (actions.length < 5) {
    actions.push({
      id: "action-technical",
      title: "페이지 속도 점검",
      description: "Google PageSpeed Insights로 페이지 로딩 속도를 점검하고 개선하세요.",
      category: "technical",
      priority: "low",
      status: "pending",
      estimatedTime: "1시간",
    });
  }

  return actions.slice(0, 5);
}
