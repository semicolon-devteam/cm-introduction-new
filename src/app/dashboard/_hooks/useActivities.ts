/**
 * 사용자 활동 조회 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Error handling with user feedback
 * - Loading states for better UX
 */

'use client';

import { useState, useEffect } from 'react';

import { activityClient } from '../_api-clients';

import type { Activity, GetActivitiesParams } from '@/models/activity.types';

interface UseActivitiesReturn {
  /** 활동 목록 */
  activities: Activity[];
  /** 전체 활동 수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
}

/**
 * 사용자 활동 조회 Hook
 *
 * @example
 * ```tsx
 * function ActivityCard({ userId }: { userId: string }) {
 *   const { activities, isLoading, error } = useActivities({ userId, limit: 5 });
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <>
 *       {activities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
 *     </>
 *   );
 * }
 * ```
 */
export function useActivities(params: GetActivitiesParams): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Factory로 생성된 싱글톤 API Client 사용
      const response = await activityClient.getActivities(params);

      setActivities(response.activities);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorMessage);

      setActivities([]);
      setTotal(0);

      console.error('[useActivities] Failed to fetch activities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId, params.limit, params.type]);

  return {
    activities,
    total,
    isLoading,
    error,
    refetch: fetchData,
  };
}
