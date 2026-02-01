import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "content" | "technical" | "backlink" | "image" | "meta" | "structure";
  estimatedTime: string;
  steps: string[];
  aiTip: string;
  status: "pending" | "in_progress" | "completed";
}

export interface WeeklyActionsResponse {
  success: boolean;
  weekStart: string;
  weekEnd: string;
  missions: WeeklyMission[];
  summary: string;
  focusKeyword: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY가 설정되지 않았습니다. .env.local에 추가해주세요.",
        },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });

    const body = await request.json();
    const { projectId, domain, keywords, currentRankings, searchConsoleData, completedMissions } =
      body as {
        projectId: string;
        domain: string;
        keywords: string[];
        currentRankings?: { keyword: string; google?: number; naver?: number }[];
        searchConsoleData?: {
          clicks: number;
          impressions: number;
          ctr: number;
          position: number;
        };
        completedMissions?: string[];
      };

    if (!keywords || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: "타겟 키워드가 필요합니다." },
        { status: 400 },
      );
    }

    // 현재 주의 시작/끝 날짜 계산
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // 월요일
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // 일요일

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    // AI 프롬프트 구성
    const prompt = `당신은 한국 SEO 전문가입니다. 사용자의 사이트 정보를 분석하고 이번 주에 해야 할 구체적인 SEO 작업 목록을 생성해주세요.

## 사이트 정보
- 도메인: ${domain}
- 프로젝트 ID: ${projectId}

## 타겟 키워드
${keywords.map((k, i) => `${i + 1}. ${k}`).join("\n")}

## 현재 순위 (있는 경우)
${
  currentRankings && currentRankings.length > 0
    ? currentRankings
        .map(
          (r) =>
            `- "${r.keyword}": Google ${r.google || "측정안됨"}위, Naver ${r.naver || "측정안됨"}위`,
        )
        .join("\n")
    : "순위 데이터 없음"
}

## Search Console 데이터 (최근 7일)
${
  searchConsoleData
    ? `- 클릭: ${searchConsoleData.clicks}회
- 노출: ${searchConsoleData.impressions}회
- CTR: ${(searchConsoleData.ctr * 100).toFixed(2)}%
- 평균 순위: ${searchConsoleData.position.toFixed(1)}위`
    : "데이터 없음"
}

## 이미 완료한 작업
${completedMissions && completedMissions.length > 0 ? completedMissions.join("\n") : "없음"}

## 요청사항
이번 주(${formatDate(weekStart)} ~ ${formatDate(weekEnd)})에 할 SEO 작업 3-5개를 생성해주세요.

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):

{
  "summary": "이번 주 SEO 전략 요약 (1-2문장)",
  "focusKeyword": "이번 주 집중할 메인 키워드",
  "missions": [
    {
      "id": "mission_1",
      "title": "작업 제목 (구체적으로)",
      "description": "무엇을 왜 해야 하는지 설명",
      "priority": "high|medium|low",
      "category": "content|technical|backlink|image|meta|structure",
      "estimatedTime": "예상 소요 시간 (예: 30분, 1시간)",
      "steps": [
        "구체적인 실행 단계 1",
        "구체적인 실행 단계 2",
        "구체적인 실행 단계 3"
      ],
      "aiTip": "이 작업의 효과를 높이는 팁"
    }
  ]
}

작업 생성 시 고려사항:
1. 초보자도 따라할 수 있도록 구체적으로 작성
2. 각 단계는 실제로 바로 실행할 수 있어야 함
3. 키워드를 자연스럽게 활용하는 방법 포함
4. Google과 네이버 모두 고려
5. 우선순위가 높은 것부터 정렬
6. 완료한 작업은 제외하고 새로운 작업 제안`;

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

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    // JSON 파싱
    let parsedResponse;
    try {
      const cleanedResponse = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedResponse = JSON.parse(cleanedResponse);
    } catch {
      // 파싱 실패 시 기본 미션 반환
      parsedResponse = {
        summary: `${keywords[0]} 키워드 순위 상승을 위한 기본 SEO 작업입니다.`,
        focusKeyword: keywords[0],
        missions: [
          {
            id: "mission_default_1",
            title: `"${keywords[0]}" 관련 블로그 글 작성`,
            description: "타겟 키워드를 중심으로 유용한 콘텐츠를 작성하여 검색 노출을 높입니다.",
            priority: "high",
            category: "content",
            estimatedTime: "1-2시간",
            steps: [
              `"${keywords[0]}"로 검색하여 상위 글 5개 분석`,
              "경쟁 글보다 더 자세한 내용으로 글 구성",
              "H1, H2 태그에 키워드 자연스럽게 포함",
              "이미지 3-5개 추가 (alt 태그 필수)",
              "내부 링크 2-3개 추가",
            ],
            aiTip: "글 길이는 최소 2,000자 이상을 권장합니다. 네이버는 특히 긴 글을 선호합니다.",
          },
          {
            id: "mission_default_2",
            title: "기존 페이지 메타태그 최적화",
            description: "메타 타이틀과 디스크립션을 최적화하여 CTR을 높입니다.",
            priority: "medium",
            category: "meta",
            estimatedTime: "30분",
            steps: [
              "메인 페이지 Title 태그 확인 (60자 이내)",
              "Meta Description 작성 (155자 이내)",
              `키워드 "${keywords[0]}" 자연스럽게 포함`,
              "클릭을 유도하는 문구 추가",
            ],
            aiTip: "숫자나 특수문자(【】, ★)를 사용하면 CTR이 높아질 수 있습니다.",
          },
        ],
      };
    }

    // 미션에 상태 추가
    const missions: WeeklyMission[] = parsedResponse.missions.map(
      (m: Omit<WeeklyMission, "status">) => ({
        ...m,
        status: "pending" as const,
      }),
    );

    const response: WeeklyActionsResponse = {
      success: true,
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      summary: parsedResponse.summary,
      focusKeyword: parsedResponse.focusKeyword,
      missions,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Weekly actions generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "주간 액션 생성 실패",
      },
      { status: 500 },
    );
  }
}

// GET: 저장된 주간 액션 조회 (LocalStorage에서 관리하므로 여기선 현재 주 정보만 반환)
export async function GET() {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  return NextResponse.json({
    success: true,
    currentWeek: {
      start: formatDate(weekStart),
      end: formatDate(weekEnd),
    },
  });
}
