/**
 * 프로필 업데이트 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Mutation 상태 관리 (로딩, 에러, 성공)
 */

'use client';

import { useState } from 'react';

import { profileClient } from '../_api-clients';

import type { UpdateProfileParams, UserProfile } from '@/models/profile.types';

interface UseUpdateProfileReturn {
  /** 업데이트 함수 */
  updateProfile: (params: UpdateProfileParams) => Promise<UserProfile | null>;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 성공 여부 */
  isSuccess: boolean;
}

/**
 * 프로필 업데이트 Hook
 *
 * @example
 * ```tsx
 * function ProfileEditForm({ userId }: { userId: string }) {
 *   const { updateProfile, isLoading, error, isSuccess } = useUpdateProfile();
 *
 *   const handleSubmit = async (data: { nickname: string }) => {
 *     const updated = await updateProfile({
 *       userId,
 *       nickname: data.nickname,
 *     });
 *
 *     if (updated) {
 *       console.log('Profile updated successfully');
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useUpdateProfile(): UseUpdateProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateProfile = async (
    params: UpdateProfileParams
  ): Promise<UserProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Factory로 생성된 싱글톤 API Client 사용
      const profile = await profileClient.updateProfile(params);

      setIsSuccess(true);
      return profile;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorMessage);

      console.error('[useUpdateProfile] Failed to update profile:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
    isSuccess,
  };
}
