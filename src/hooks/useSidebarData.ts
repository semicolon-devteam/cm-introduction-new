/**
 * Sidebar 데이터 조회 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Error handling with user feedback
 * - Loading states for better UX
 * - Auto refresh (5분마다)
 */

'use client';

import { useState, useEffect } from 'react';

import { sidebarClient } from '@/lib/api-clients/sidebar.client';

import type { TrendingTopic, CommunityStat } from '@/models/sidebar.types';

interface UseSidebarDataReturn {
  /** 인기 토픽 목록 */
  trendingTopics: TrendingTopic[];
  /** 커뮤니티 통계 */
  communityStats: CommunityStat[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
}

/**
 * Sidebar 데이터 조회 Hook
 * - 인기 토픽과 커뮤니티 통계를 병렬로 조회
 * - 5분마다 자동 갱신 (stale time)
 * - 에러 발생 시 빈 배열 반환 및 에러 상태 노출
 *
 * @example
 * ```tsx
 * function SidebarContainer() {
 *   const { trendingTopics, communityStats, isLoading, error } = useSidebarData();
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return <Sidebar topics={trendingTopics} stats={communityStats} />;
 * }
 * ```
 */
export function useSidebarData(): UseSidebarDataReturn {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Factory로 생성된 싱글톤 API Client 사용
      // API Route에서 이미 병렬 처리됨
      const data = await sidebarClient.getSidebarData();

      setTrendingTopics(data.trendingTopics);
      setCommunityStats(data.communityStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorMessage);

      // 에러 발생 시에도 빈 배열로 UI 렌더링 가능하도록 설정
      setTrendingTopics([]);
      setCommunityStats([]);

      console.error('[useSidebarData] Failed to fetch sidebar data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();

    // 5분마다 자동 갱신
    const intervalId = setInterval(
      () => {
        void fetchData();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, []);

  return {
    trendingTopics,
    communityStats,
    isLoading,
    error,
    refetch: fetchData,
  };
}
