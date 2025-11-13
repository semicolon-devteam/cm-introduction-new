/**
 * useProfile Hook 단위 테스트
 * React 상태 관리 및 API 호출 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useProfile } from "../useProfile";

import type { GetProfileResponse, UserProfile } from "@/models/profile.types";

import { profileClient } from "@/app/profile/_api-clients";

// Mock profileClient
vi.mock("@/app/profile/_api-clients", () => ({
  profileClient: {
    getProfile: vi.fn(),
  },
}));

// Mock profile data
const mockProfile: UserProfile = {
  id: 1,
  auth_user_id: "uuid-123",
  email: "test@example.com",
  nickname: "TestUser",
  login_id: "testuser",
  avatar_path: "https://example.com/avatar.jpg",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
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

// Helper to create mock response
const createMockResponse = (override?: Partial<GetProfileResponse>): GetProfileResponse => ({
  profile: mockProfile,
  ...override,
});

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(profileClient.getProfile).mockResolvedValue(createMockResponse());
  });

  describe("초기 로딩", () => {
    it("초기 상태는 로딩 중이다", () => {
      const { result } = renderHook(() => useProfile("user-123"));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.profile).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("데이터 로딩이 완료되면 프로필을 반환한다", async () => {
      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.profile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it("에러 발생 시 에러를 반환한다", async () => {
      const errorMessage = "Failed to fetch profile";
      vi.mocked(profileClient.getProfile).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.profile).toBeNull();
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  describe("userId 파라미터", () => {
    it("userId로 프로필을 조회한다", async () => {
      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(profileClient.getProfile).toHaveBeenCalledWith("user-123");
    });

    it("userId 변경 시 재조회한다", async () => {
      const { result, rerender } = renderHook(({ userId }) => useProfile(userId), {
        initialProps: { userId: "user-123" },
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(profileClient.getProfile).mock.calls.length;

      rerender({ userId: "user-456" });

      await waitFor(() => {
        expect(vi.mocked(profileClient.getProfile).mock.calls.length).toBe(callCountBefore + 1);
      });

      expect(profileClient.getProfile).toHaveBeenLastCalledWith("user-456");
    });
  });

  describe("데이터 새로고침", () => {
    it("refetch로 데이터를 다시 로드한다", async () => {
      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(profileClient.getProfile).mock.calls.length;

      await result.current.refetch();

      await waitFor(() => {
        expect(vi.mocked(profileClient.getProfile).mock.calls.length).toBe(callCountBefore + 1);
      });
    });

    it("refetch 중 에러가 발생하면 에러 상태를 업데이트한다", async () => {
      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      vi.mocked(profileClient.getProfile).mockRejectedValueOnce(new Error("Refetch failed"));

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBe("Refetch failed");
      });

      expect(result.current.profile).toBeNull();
    });
  });

  describe("프로필 데이터 검증", () => {
    it("올바른 프로필 구조를 반환한다", async () => {
      const { result } = renderHook(() => useProfile("user-123"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const profile = result.current.profile;
      expect(profile).toHaveProperty("id");
      expect(profile).toHaveProperty("auth_user_id");
      expect(profile).toHaveProperty("email");
      expect(profile).toHaveProperty("nickname");
      expect(profile).toHaveProperty("login_id");
      expect(profile).toHaveProperty("avatar_path");
      expect(profile).toHaveProperty("created_at");
      expect(profile).toHaveProperty("updated_at");
    });
  });
});
