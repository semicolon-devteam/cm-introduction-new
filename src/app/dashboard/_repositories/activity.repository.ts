/**
 * Activity Repository
 * Development Philosophy - Repository Layer (2️⃣)
 *
 * 책임:
 * - 서버사이드 데이터 접근 (createServerSupabaseClient 사용)
 * - 사용자 활동 데이터 조회
 * - posts 테이블 기반 활동 추적
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Activity, GetActivitiesParams, GetActivitiesResponse } from "@/models/activity.types";

/**
 * Activity Repository 클래스
 * 서버사이드 전용 - API Routes에서만 호출
 */
export class ActivityRepository {
  /**
   * 사용자 활동 조회
   * posts 테이블에서 사용자가 작성한 게시글 기반으로 활동 생성
   *
   * @param params - 조회 파라미터 (userId는 auth_user_id UUID)
   * @returns 사용자 활동 목록
   */
  async getActivities(params: GetActivitiesParams): Promise<GetActivitiesResponse> {
    const { userId, limit = 5 } = params;

    const supabase = await createServerSupabaseClient();

    // 1. auth_user_id (UUID)로 users.id (bigint) 조회
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (userError || !user) {
      console.error("[ActivityRepository] Failed to find user:", userError);
      return {
        activities: [],
        total: 0,
      };
    }

    // 2. users.id로 posts 조회
    const {
      data: posts,
      error,
      count,
    } = await supabase
      .from("posts")
      .select("id, title, created_at, view_count", { count: "exact" })
      .eq("writer_id", user.id)
      .eq("status", "published")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[ActivityRepository] Failed to fetch activities:", error);
      return {
        activities: [],
        total: 0,
      };
    }

    // posts 데이터를 Activity 형식으로 변환
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activities: Activity[] =
      posts?.map((post: any) => ({
        id: post.id.toString(),
        type: "post_created" as const,
        title: "새 게시글 작성",
        description: post.title,
        createdAt: post.created_at,
        link: `/posts/${post.id}`,
        icon: "FileText",
      })) ?? [];

    return {
      activities,
      total: count ?? 0,
    };
  }

  /**
   * 사용자의 총 활동 수 조회
   *
   * @param userId - 사용자 ID (auth_user_id UUID)
   * @returns 총 활동 수
   */
  async getTotalActivities(userId: string): Promise<number> {
    const supabase = await createServerSupabaseClient();

    // 1. auth_user_id (UUID)로 users.id (bigint) 조회
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (userError || !user) {
      console.error("[ActivityRepository] Failed to find user:", userError);
      return 0;
    }

    // 2. users.id로 posts 개수 조회
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("writer_id", user.id)
      .eq("status", "published")
      .is("deleted_at", null);

    if (error) {
      console.error("[ActivityRepository] Failed to fetch total activities:", error);
      return 0;
    }

    return count ?? 0;
  }
}
