import { NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyMission } from "@/app/api/dashboard/seo/weekly-actions/mission-verifier";

// 미션 타입 (마이그레이션 전 타입 호환성을 위해 별도 정의)
interface MissionRow {
  id: number;
  domain: string;
  category: string;
  title: string;
  description: string;
  verification_status?: string;
}

// Vercel Cron 요청 검증
function verifyCronSecret(request: NextRequest): boolean {
  // Vercel Cron은 자동으로 이 헤더를 포함
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  if (isVercelCron) return true;

  // 수동 호출 시 CRON_SECRET 검증
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // CRON_SECRET이 없으면 모든 요청 허용 (개발/테스트용)
  if (!cronSecret) return true;

  return authHeader === `Bearer ${cronSecret}`;
}

// 이번 주 시작일 계산 (월요일 기준, KST 시간대 사용)
function getWeekStart(): string {
  // Vercel 서버는 UTC로 실행되므로 KST(+9)로 변환
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로
  const kstNow = new Date(now.getTime() + kstOffset);

  const dayOfWeek = kstNow.getUTCDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekStart = new Date(kstNow);
  weekStart.setUTCDate(kstNow.getUTCDate() + diff);

  // YYYY-MM-DD 형식 반환
  const year = weekStart.getUTCFullYear();
  const month = String(weekStart.getUTCMonth() + 1).padStart(2, "0");
  const day = String(weekStart.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 매일 00:00 KST에 실행되는 Cron Job
 * 완료된 미션을 재검증하여 실제 구현 여부 확인
 */
export async function GET(request: NextRequest) {
  // Cron Secret 검증
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const weekStart = getWeekStart();

    // 이번 주 완료된 미션 조회 (verification_status 필터는 코드에서 처리)
    const { data: completedMissions, error } = await supabase
      .from("seo_weekly_missions")
      .select("*")
      .eq("week_start", weekStart)
      .eq("status", "completed");

    if (error) {
      console.error("Query error:", error);
      return NextResponse.json({ error: "DB 조회 실패", details: error.message }, { status: 500 });
    }

    // 타입 캐스팅 및 아직 검증되지 않은 것만 필터
    const allMissions = (completedMissions || []) as MissionRow[];
    const missions = allMissions.filter(
      (m) => !m.verification_status || m.verification_status === "pending",
    );

    if (missions.length === 0) {
      const now = new Date();
      return NextResponse.json({
        success: true,
        message: "검증할 미션이 없습니다",
        verified: 0,
        failed: 0,
        debug: {
          serverTimeUTC: now.toISOString(),
          serverTimeKST: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString(),
          calculatedWeekStart: weekStart,
          totalCompleted: allMissions.length,
          alreadyVerified: allMissions.filter((m) => m.verification_status === "verified").length,
          alreadyFailed: allMissions.filter((m) => m.verification_status === "failed").length,
        },
      });
    }

    // 도메인별로 그룹화 (한 도메인에 대해 한 번만 사이트 분석)
    const domainGroups = missions.reduce(
      (acc, mission) => {
        if (!acc[mission.domain]) {
          acc[mission.domain] = [];
        }
        acc[mission.domain].push(mission);
        return acc;
      },
      {} as Record<string, MissionRow[]>,
    );

    let verifiedCount = 0;
    let failedCount = 0;

    // 각 도메인별로 미션 검증
    for (const [domain, domainMissions] of Object.entries(domainGroups)) {
      for (const mission of domainMissions) {
        try {
          const result = await verifyMission(
            domain,
            mission.category,
            mission.title,
            mission.description,
          );

          // 검증 결과 DB 업데이트 (RPC 함수로 PostgREST 캐시 우회)
          const { error: updateError } = await supabase.rpc("update_mission_verification", {
            p_mission_id: mission.id,
            p_status: result.verified ? "verified" : "failed",
            p_message: result.message,
          });

          if (updateError) {
            console.error(`Update error for mission ${mission.id}:`, updateError);
          } else {
            if (result.verified) {
              verifiedCount++;
            } else {
              failedCount++;
            }
          }
        } catch (err) {
          console.error(`Verification error for mission ${mission.id}:`, err);
          // 검증 실패 기록 (RPC 함수로 PostgREST 캐시 우회)
          await supabase.rpc("update_mission_verification", {
            p_mission_id: mission.id,
            p_status: "failed",
            p_message: "검증 중 오류 발생",
          });
          failedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `검증 완료: ${verifiedCount}개 성공, ${failedCount}개 실패`,
      verified: verifiedCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "서버 오류" },
      { status: 500 },
    );
  }
}
