/**
 * LeadersRepository 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { LeadersRepository } from "../leaders.repository";

import type { CareerItem, SocialLinks } from "@/lib/supabase/database.types";

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from "@/lib/supabase/server";

// Helper function
function createMockLeader(overrides = {}) {
  return {
    id: 1,
    slug: "test-leader",
    name: "테스트 리더",
    nickname: "Test",
    position: "CTO",
    summary: "테스트 요약",
    career: [{ company: "Test Corp", role: "Developer", period: "2020-2023" }] as CareerItem[],
    profile_image: "/images/test.jpg",
    message: "테스트 메시지",
    skills: ["TypeScript", "React"],
    social_links: { github: "https://github.com/test" } as SocialLinks,
    is_active: true,
    display_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: null,
    ...overrides,
  };
}

describe("LeadersRepository", () => {
  let repository: LeadersRepository;
  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
    };

    vi.mocked(createServerSupabaseClient).mockResolvedValue(
      mockSupabase as unknown as Awaited<ReturnType<typeof createServerSupabaseClient>>
    );

    repository = new LeadersRepository();
  });

  describe("getLeaders", () => {
    it("리더 목록을 조회한다", async () => {
      const mockData = [createMockLeader(), createMockLeader({ id: 2, slug: "leader-2" })];

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.getLeaders();

      expect(result.leaders).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.leaders[0].name).toBe("테스트 리더");
    });

    it("비활성 리더 포함 조회가 동작한다", async () => {
      const mockData = [createMockLeader()];

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      const result = await repository.getLeaders({ includeInactive: true });

      expect(result.leaders).toHaveLength(1);
    });

    it("에러 발생 시 예외를 던진다", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        }),
      });

      await expect(repository.getLeaders()).rejects.toThrow("Failed to fetch leaders");
    });

    it("빈 목록일 때 빈 배열을 반환한다", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await repository.getLeaders();

      expect(result.leaders).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe("getLeaderById", () => {
    it("ID로 리더를 조회한다", async () => {
      const mockData = createMockLeader();

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.getLeaderById(1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe("테스트 리더");
    });

    it("존재하지 않는 ID일 때 null을 반환한다", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "PGRST116", message: "Not found" },
            }),
          }),
        }),
      });

      const result = await repository.getLeaderById(999);

      expect(result).toBeNull();
    });

    it("다른 에러 발생 시 예외를 던진다", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: "OTHER", message: "Database error" },
            }),
          }),
        }),
      });

      await expect(repository.getLeaderById(1)).rejects.toThrow("Failed to fetch leader");
    });
  });

  describe("getLeaderBySlug", () => {
    it("Slug로 리더를 조회한다", async () => {
      const mockData = createMockLeader();

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
            }),
          }),
        }),
      });

      const result = await repository.getLeaderBySlug("test-leader");

      expect(result).not.toBeNull();
      expect(result?.slug).toBe("test-leader");
    });

    it("존재하지 않는 Slug일 때 null을 반환한다", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116", message: "Not found" },
              }),
            }),
          }),
        }),
      });

      const result = await repository.getLeaderBySlug("non-existent");

      expect(result).toBeNull();
    });
  });
});
