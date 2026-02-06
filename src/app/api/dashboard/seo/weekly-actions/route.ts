import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

import { analyzeSite } from "./site-analyzer";
import { generateActionsFromIssues } from "./action-generator";
import type { WeeklyAction, WeeklyActionsResponse } from "./types";

export type { WeeklyAction, WeeklyActionsResponse };

// DB Row 타입
type SEOWeeklyMissionRow = Database["public"]["Tables"]["seo_weekly_missions"]["Row"];

// 이번 주 시작일 계산 (월요일 기준)
function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split("T")[0];
}

// Row를 WeeklyAction으로 변환
function rowToAction(row: SEOWeeklyMissionRow): WeeklyAction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyRow = row as any;
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    estimatedTime: row.estimated_time,
    aiTip: row.ai_tip || undefined,
    // 검증 필드 (마이그레이션 전에는 undefined)
    verificationStatus: anyRow.verification_status || undefined,
    verifiedAt: anyRow.verified_at || undefined,
    verificationMessage: anyRow.verification_message || undefined,
  };
}

// GET: 이번 주 미션 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const weekStart = getWeekStart();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("seo_weekly_missions")
      .select("*")
      .eq("domain", domain)
      .eq("week_start", weekStart)
      .order("priority", { ascending: true });

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json({ success: false, error: "미션 조회 실패" }, { status: 500 });
    }

    const typedData = data as SEOWeeklyMissionRow[] | null;
    const summary = typedData?.[0]?.summary || null;
    const actions = (typedData || []).map(rowToAction);

    return NextResponse.json({ success: true, actions, summary });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 });
  }
}

// POST: 새로운 미션 생성 (실제 사이트 분석 기반)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, keywords, forceRegenerate } = body as {
      domain: string;
      keywords: string[];
      forceRegenerate?: boolean;
    };

    if (!domain) {
      return NextResponse.json({ success: false, error: "도메인이 필요합니다." }, { status: 400 });
    }

    const weekStart = getWeekStart();
    const supabase = await createServerSupabaseClient();

    // 이미 이번 주 미션이 있는지 확인
    if (!forceRegenerate) {
      const { data: existing } = await supabase
        .from("seo_weekly_missions")
        .select("id")
        .eq("domain", domain)
        .eq("week_start", weekStart)
        .limit(1);

      if (existing && existing.length > 0) {
        const { data } = await supabase
          .from("seo_weekly_missions")
          .select("*")
          .eq("domain", domain)
          .eq("week_start", weekStart)
          .order("priority", { ascending: true });

        const typedData = data as SEOWeeklyMissionRow[] | null;
        return NextResponse.json({
          success: true,
          actions: (typedData || []).map(rowToAction),
          summary: typedData?.[0]?.summary || "",
          cached: true,
        });
      }
    } else {
      // 기존 미션 삭제
      await supabase
        .from("seo_weekly_missions")
        .delete()
        .eq("domain", domain)
        .eq("week_start", weekStart);
    }

    // 실제 사이트 분석
    const { issues, pageData } = await analyzeSite(domain);

    // AI로 맞춤 미션 생성
    const apiKey = process.env.GROQ_API_KEY;
    let actions: WeeklyAction[] = [];
    let summary = "";

    if (apiKey && issues.length > 0) {
      const groq = new Groq({ apiKey });
      const issuesSummary = issues
        .slice(0, 10)
        .map((i) => `- [${i.priority}] ${i.message}`)
        .join("\n");

      const prompt = `당신은 SEO 전문가입니다. 다음 사이트 분석 결과를 바탕으로 이번 주에 반드시 해결해야 할 구체적인 SEO 액션 5가지를 추천해주세요.

도메인: ${domain}
타겟 키워드: ${keywords.slice(0, 5).join(", ") || "미설정"}

[실제 사이트 분석 결과]
- 현재 Title: "${pageData.title || "없음"}"
- 현재 Description: "${pageData.description || "없음"}"
- H1 태그 수: ${pageData.h1Count}개
- alt 없는 이미지: ${pageData.imgWithoutAlt}개

[발견된 이슈]
${issuesSummary}

위 실제 분석 결과를 바탕으로 가장 시급한 문제부터 해결하는 액션을 제안하세요.

다음 JSON 형식으로만 응답하세요:
{
  "summary": "이번 주 핵심 개선 방향 (분석 결과 기반, 1-2문장)",
  "actions": [
    {
      "id": "action-1",
      "title": "구체적인 액션 제목",
      "description": "상세 설명 - 현재 문제점과 정확히 어떻게 수정해야 하는지",
      "category": "content|technical|link|image|meta 중 하나",
      "priority": "high|medium|low 중 하나",
      "estimatedTime": "예상 소요 시간",
      "aiTip": "구체적인 실행 팁 (예: 현재 title을 어떻게 수정하면 좋을지)"
    }
  ]
}

중요: 발견된 이슈를 직접 해결하는 실질적인 액션만 제안하세요.`;

      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content || "{}";
        const cleaned = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        summary = parsed.summary || "";
        actions = (parsed.actions || []).map((a: WeeklyAction, idx: number) => ({
          ...a,
          id: `action-${idx + 1}`,
          status: "pending" as const,
        }));
      } catch {
        actions = generateActionsFromIssues(issues, keywords);
        summary = `${domain}에서 ${issues.length}개의 SEO 이슈가 발견되었습니다.`;
      }
    } else {
      actions = generateActionsFromIssues(issues, keywords);
      summary =
        issues.length > 0
          ? `${domain}에서 ${issues.length}개의 SEO 이슈가 발견되었습니다.`
          : "기본 SEO 개선 액션을 생성했습니다.";
    }

    // DB에 저장
    const insertData = actions.map((action) => ({
      domain,
      week_start: weekStart,
      title: action.title,
      description: action.description,
      category: action.category,
      priority: action.priority,
      status: action.status,
      estimated_time: action.estimatedTime,
      ai_tip: action.aiTip || null,
      summary,
    }));

    const { error: insertError } = await supabase.from("seo_weekly_missions").insert(insertData);

    if (insertError) {
      console.error("Insert error:", insertError);
    }

    // 저장 후 ID 포함해서 다시 조회
    const { data: savedData } = await supabase
      .from("seo_weekly_missions")
      .select("*")
      .eq("domain", domain)
      .eq("week_start", weekStart)
      .order("priority", { ascending: true });

    const typedSavedData = savedData as SEOWeeklyMissionRow[] | null;
    const savedActions = (typedSavedData || []).map(rowToAction);

    return NextResponse.json({
      success: true,
      actions: savedActions.length > 0 ? savedActions : actions,
      summary,
    } as WeeklyActionsResponse);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "미션 생성 실패" },
      { status: 500 },
    );
  }
}

// PATCH: 미션 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: "pending" | "in_progress" | "completed" };

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id와 status가 필요합니다." },
        { status: 400 },
      );
    }

    // ID가 숫자형인지 확인 (DB 저장 후 조회하면 숫자 ID)
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      // 임시 ID (action-1 등)의 경우 - 아직 DB에 저장되지 않은 상태
      // 에러를 반환하지 않고 성공으로 처리 (클라이언트 UI 상태만 변경)
      return NextResponse.json({ success: true, message: "클라이언트 상태만 업데이트됨" });
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("seo_weekly_missions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", numericId);

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ success: false, error: "상태 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 });
  }
}
