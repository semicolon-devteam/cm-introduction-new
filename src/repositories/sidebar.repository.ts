/**
 * 사이드바 Repository
 * Development Philosophy - Repository Layer (2️⃣)
 *
 * 책임:
 * - 서버사이드 데이터 접근 (createServerSupabaseClient 사용)
 * - 트렌딩 토픽, 커뮤니티 통계 조회
 * - 병렬 쿼리 처리
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';

import type { TrendingTopic, CommunityStat } from '@/models/sidebar.types';


/**
 * 사이드바 Repository 클래스
 * 서버사이드 전용 - API Routes에서만 호출
 */
export class SidebarRepository {
  /**
   * 인기 토픽 조회
   * @returns 조회수 상위 5개 게시글
   */
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('title, view_count')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('view_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('[SidebarRepository] Failed to fetch trending topics:', error);
      return [];
    }

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.map((post: any) => ({
        name: post.title,
        count: post.view_count,
      })) ?? []
    );
  }

  /**
   * 커뮤니티 통계 조회
   * @returns 사용자 수, 오늘 게시글 수, 주간 인기글
   */
  async getCommunityStats(): Promise<CommunityStat[]> {
    const supabase = await createServerSupabaseClient();

    // 병렬 쿼리 실행
    const [usersResult, todayPostsResult, weeklyPopularResult] = await Promise.all([
      // 전체 사용자 수
      supabase.from('users').select('*', { count: 'exact', head: true }),

      // 오늘 작성된 게시글 수
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .is('deleted_at', null)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),

      // 주간 인기 게시글 수
      supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .is('deleted_at', null)
        .gte(
          'created_at',
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        )
        .gte('like_count', 10),
    ]);

    const stats: CommunityStat[] = [
      {
        label: '전체 멤버',
        value: `${usersResult.count ?? 0}명`,
        icon: 'Users',
      },
      {
        label: '오늘 게시글',
        value: `${todayPostsResult.count ?? 0}개`,
        icon: 'Calendar',
      },
      {
        label: '주간 인기글',
        value: `${weeklyPopularResult.count ?? 0}개`,
        icon: 'Trophy',
      },
    ];

    return stats;
  }
}
