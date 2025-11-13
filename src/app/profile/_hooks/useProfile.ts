/**
 * 프로필 조회 Custom Hook
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

import { profileClient } from '../_api-clients';

import type { UserProfile } from '@/models/profile.types';

interface UseProfileReturn {
  /** 프로필 정보 */
  profile: UserProfile | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
}

/**
 * 프로필 조회 Hook
 *
 * @example
 * ```tsx
 * function ProfilePage({ userId }: { userId: string }) {
 *   const { profile, isLoading, error } = useProfile(userId);
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   if (!profile) return <NotFound />;
 *
 *   return <ProfileView profile={profile} />;
 * }
 * ```
 */
export function useProfile(userId: string): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Factory로 생성된 싱글톤 API Client 사용
      const response = await profileClient.getProfile(userId);
      setProfile(response.profile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorMessage);
      setProfile(null);

      console.error('[useProfile] Failed to fetch profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchData,
  };
}
