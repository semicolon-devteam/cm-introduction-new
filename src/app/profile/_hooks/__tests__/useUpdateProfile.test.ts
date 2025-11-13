/**
 * useUpdateProfile Hook 단위 테스트
 * 프로필 업데이트 Mutation 상태 관리 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useUpdateProfile } from "../useUpdateProfile";

import type { UpdateProfileParams, UserProfile } from "@/models/profile.types";

import { profileClient } from "@/app/profile/_api-clients";

// Mock profileClient
vi.mock("@/app/profile/_api-clients", () => ({
  profileClient: {
    updateProfile: vi.fn(),
  },
}));

// Mock profile data
const mockProfile: UserProfile = {
  id: 1,
  auth_user_id: "uuid-123",
  email: "test@example.com",
  nickname: "UpdatedUser",
  login_id: "testuser",
  avatar_path: "https://example.com/avatar.jpg",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-02T00:00:00Z",
  status: "active",
  permission_type: "user",
  activity_level: 1,
  info_open_settings: {},
  birthdate: null,
  gender: null,
  phone_number: null,
  invite_code: "ABC123",
  invited_by: null,
  nickname_changed_at: null,
  is_withdrawal_requested: false,
  deleted_at: null,
};

describe("useUpdateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profileClient.updateProfile).mockResolvedValue(mockProfile);
  });

  describe("초기 상태", () => {
    it("초기 상태는 idle이다", () => {
      const { result } = renderHook(() => useUpdateProfile());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(false);
      expect(typeof result.current.updateProfile).toBe("function");
    });
  });

  describe("프로필 업데이트", () => {
    it("닉네임을 업데이트한다", async () => {
      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      let updatedProfile: UserProfile | null = null;

      await waitFor(async () => {
        updatedProfile = await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(profileClient.updateProfile).toHaveBeenCalledWith(params);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(updatedProfile).toEqual(mockProfile);
    });

    it("아바타 URL을 업데이트한다", async () => {
      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        avatar_path: "https://example.com/new-avatar.jpg",
      };

      let updatedProfile: UserProfile | null = null;

      await waitFor(async () => {
        updatedProfile = await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(profileClient.updateProfile).toHaveBeenCalledWith(params);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(updatedProfile).toEqual(mockProfile);
    });

    it("닉네임과 아바타 URL을 함께 업데이트한다", async () => {
      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
        avatar_path: "https://example.com/new-avatar.jpg",
      };

      let updatedProfile: UserProfile | null = null;

      await waitFor(async () => {
        updatedProfile = await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(profileClient.updateProfile).toHaveBeenCalledWith(params);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(updatedProfile).toEqual(mockProfile);
    });
  });

  describe("에러 처리", () => {
    it("업데이트 실패 시 에러를 반환한다", async () => {
      const errorMessage = "Update failed";
      vi.mocked(profileClient.updateProfile).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      let updatedProfile: UserProfile | null = null;

      await waitFor(async () => {
        updatedProfile = await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe(errorMessage);
      expect(result.current.isSuccess).toBe(false);
      expect(updatedProfile).toBeNull();
    });

    it("에러 후 재시도하면 에러가 초기화된다", async () => {
      const errorMessage = "First attempt failed";
      vi.mocked(profileClient.updateProfile).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      // 첫 번째 시도 (실패)
      await waitFor(async () => {
        await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error?.message).toBe(errorMessage);

      // 두 번째 시도 (성공)
      vi.mocked(profileClient.updateProfile).mockResolvedValueOnce(mockProfile);

      await waitFor(async () => {
        await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe("로딩 상태", () => {
    it("업데이트 중에는 로딩 상태가 true이다", async () => {
      // API 호출을 지연시켜 로딩 상태 확인
      vi.mocked(profileClient.updateProfile).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockProfile), 100);
          }),
      );

      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      // 업데이트 시작
      const promise = result.current.updateProfile(params);

      // 로딩 상태 확인 (짧은 대기 후)
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(result.current.isLoading).toBe(true);

      // 완료 대기
      await promise;

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("성공 상태", () => {
    it("성공 시 isSuccess가 true가 된다", async () => {
      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      await waitFor(async () => {
        await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });

    it("새로운 업데이트 시작 시 isSuccess가 초기화된다", async () => {
      const { result } = renderHook(() => useUpdateProfile());

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      // 첫 번째 업데이트 (성공)
      await waitFor(async () => {
        await result.current.updateProfile(params);
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);

      // 두 번째 업데이트 시작 시 isSuccess가 false로 초기화되어야 함
      // API 호출을 지연시켜 확인
      vi.mocked(profileClient.updateProfile).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockProfile), 100);
          }),
      );

      const promise = result.current.updateProfile({
        authUserId: "uuid-123",
        nickname: "AnotherUser",
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(result.current.isSuccess).toBe(false);

      await promise;
    });
  });
});
