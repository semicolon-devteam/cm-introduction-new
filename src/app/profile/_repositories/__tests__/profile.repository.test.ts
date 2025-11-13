/**
 * Profile Repository 단위 테스트
 * 서버사이드 Supabase 쿼리 및 프로필 CRUD 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { ProfileRepository } from "../profile.repository";

import type { UpdateProfileParams } from "@/models/profile.types";

import { createServerSupabaseClient } from "@/lib/supabase/server";

// Mock Supabase server client
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

// Mock profile data
const mockProfileData = {
  id: 1,
  auth_user_id: "uuid-123",
  email: "test@example.com",
  nickname: "TestUser",
  login_id: "testuser",
  avatar_path: "https://example.com/avatar.jpg",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  status: "active" as const,
  permission_type: "user" as const,
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

describe("ProfileRepository", () => {
  let repository: ProfileRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ProfileRepository();
  });

  describe("getProfile", () => {
    it("사용자 프로필을 조회한다", async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: mockProfileData,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await repository.getProfile("uuid-123");

      // Supabase 쿼리 검증
      expect(mockSupabase.from).toHaveBeenCalledWith("users");
      expect(mockFrom.select).toHaveBeenCalledWith("*");
      expect(mockFrom.eq).toHaveBeenCalledWith("auth_user_id", "uuid-123");
      expect(mockFrom.single).toHaveBeenCalled();

      // 응답 검증
      expect(result.profile).toEqual(mockProfileData);
    });

    it("프로필이 없을 경우 에러를 throw한다", async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: null,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      await expect(repository.getProfile("uuid-123")).rejects.toThrow("프로필을 찾을 수 없습니다.");
    });

    it("에러 발생 시 에러를 throw한다", async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      await expect(repository.getProfile("uuid-123")).rejects.toThrow(
        "프로필을 불러오는데 실패했습니다.",
      );
    });
  });

  describe("updateProfile", () => {
    it("닉네임을 업데이트한다", async () => {
      const updatedData = {
        ...mockProfileData,
        nickname: "UpdatedUser",
        updated_at: "2025-01-02T00:00:00Z",
      };

      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: updatedData,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      const result = await repository.updateProfile(params);

      // Supabase 쿼리 검증
      expect(mockSupabase.from).toHaveBeenCalledWith("users");
      expect(mockFrom.update).toHaveBeenCalledWith({ nickname: "UpdatedUser" });
      expect(mockFrom.eq).toHaveBeenCalledWith("auth_user_id", "uuid-123");
      expect(mockFrom.select).toHaveBeenCalled();
      expect(mockFrom.single).toHaveBeenCalled();

      // 응답 검증
      expect(result.nickname).toBe("UpdatedUser");
    });

    it("아바타 경로를 업데이트한다", async () => {
      const updatedData = {
        ...mockProfileData,
        avatar_path: "https://example.com/new-avatar.jpg",
        updated_at: "2025-01-02T00:00:00Z",
      };

      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: updatedData,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        avatar_path: "https://example.com/new-avatar.jpg",
      };

      const result = await repository.updateProfile(params);

      // Supabase 쿼리 검증
      expect(mockFrom.update).toHaveBeenCalledWith({
        avatar_path: "https://example.com/new-avatar.jpg",
      });

      // 응답 검증
      expect(result.avatar_path).toBe("https://example.com/new-avatar.jpg");
    });

    it("닉네임과 아바타 경로를 함께 업데이트한다", async () => {
      const updatedData = {
        ...mockProfileData,
        nickname: "UpdatedUser",
        avatar_path: "https://example.com/new-avatar.jpg",
        updated_at: "2025-01-02T00:00:00Z",
      };

      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: updatedData,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
        avatar_path: "https://example.com/new-avatar.jpg",
      };

      const result = await repository.updateProfile(params);

      // Supabase 쿼리 검증
      expect(mockFrom.update).toHaveBeenCalledWith({
        nickname: "UpdatedUser",
        avatar_path: "https://example.com/new-avatar.jpg",
      });

      // 응답 검증
      expect(result.nickname).toBe("UpdatedUser");
      expect(result.avatar_path).toBe("https://example.com/new-avatar.jpg");
    });

    it("업데이트 실패 시 에러를 throw한다", async () => {
      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      await expect(repository.updateProfile(params)).rejects.toThrow(
        "프로필 업데이트에 실패했습니다.",
      );
    });

    it("업데이트 후 데이터가 없으면 에러를 throw한다", async () => {
      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn(),
      };

      mockFrom.single.mockResolvedValue({
        data: null,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const params: UpdateProfileParams = {
        authUserId: "uuid-123",
        nickname: "UpdatedUser",
      };

      await expect(repository.updateProfile(params)).rejects.toThrow(
        "업데이트된 프로필을 찾을 수 없습니다.",
      );
    });
  });
});
