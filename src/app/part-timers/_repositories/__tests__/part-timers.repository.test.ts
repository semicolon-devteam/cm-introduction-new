/**
 * PartTimersRepository Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { PartTimersRepository } from "../part-timers.repository";

const mockCreateServerSupabaseClient = vi.mocked(createServerSupabaseClient);

describe("PartTimersRepository", () => {
  let repository: PartTimersRepository;
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repository = new PartTimersRepository();
    vi.clearAllMocks();

    mockSupabase = {
      from: vi.fn(),
    };
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase as never);
  });

  describe("getPartTimers", () => {
    it("활성 파트타이머 목록을 조회한다", async () => {
      // Arrange
      const mockData = [
        {
          id: 1,
          nickname: "Garden",
          role: "Backend Developer",
          team: "Core Team",
          is_active: true,
          display_order: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: null,
        },
        {
          id: 2,
          nickname: "Reus",
          role: "Frontend Developer",
          team: "Core Team",
          is_active: true,
          display_order: 2,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: null,
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act
      const result = await repository.getPartTimers();

      // Assert
      expect(result.partTimers).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.partTimers[0]).toMatchObject({
        id: 1,
        nickname: "Garden",
        role: "Backend Developer",
        team: "Core Team",
        isActive: true,
      });
      expect(mockQuery.eq).toHaveBeenCalledWith("is_active", true);
    });

    it("includeInactive=true일 때 모든 파트타이머를 조회한다", async () => {
      // Arrange
      const mockData = [
        {
          id: 1,
          nickname: "Garden",
          role: "Backend Developer",
          team: "Core Team",
          is_active: true,
          display_order: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: null,
        },
        {
          id: 3,
          nickname: "Inactive",
          role: "Developer",
          team: null,
          is_active: false,
          display_order: 99,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: null,
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        eq: vi.fn(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act
      const result = await repository.getPartTimers({ includeInactive: true });

      // Assert
      expect(result.partTimers).toHaveLength(2);
      expect(mockQuery.eq).not.toHaveBeenCalled();
    });

    it("에러 발생 시 예외를 던진다", async () => {
      // Arrange
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act & Assert
      await expect(repository.getPartTimers()).rejects.toThrow(
        "Failed to fetch part-timers: Database error"
      );
    });

    it("빈 목록일 때 빈 배열을 반환한다", async () => {
      // Arrange
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act
      const result = await repository.getPartTimers();

      // Assert
      expect(result.partTimers).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getPartTimerById", () => {
    it("ID로 파트타이머를 조회한다", async () => {
      // Arrange
      const mockData = {
        id: 1,
        nickname: "Garden",
        role: "Backend Developer",
        team: "Core Team",
        is_active: true,
        display_order: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: null,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act
      const result = await repository.getPartTimerById(1);

      // Assert
      expect(result).toMatchObject({
        id: 1,
        nickname: "Garden",
        role: "Backend Developer",
      });
      expect(mockQuery.eq).toHaveBeenCalledWith("id", 1);
    });

    it("존재하지 않는 ID일 때 null을 반환한다", async () => {
      // Arrange
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST116", message: "Not found" },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act
      const result = await repository.getPartTimerById(999);

      // Assert
      expect(result).toBeNull();
    });

    it("다른 에러 발생 시 예외를 던진다", async () => {
      // Arrange
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: "PGRST500", message: "Server error" },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      // Act & Assert
      await expect(repository.getPartTimerById(1)).rejects.toThrow(
        "Failed to fetch part-timer: Server error"
      );
    });
  });
});
