/**
 * SemoStatsRepository Unit Tests
 *
 * PostgreSQL 쿼리를 모킹하여 Repository 로직 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { SemoStatsRepository } from "../semo-stats.repository";

// Mock semo-db module
vi.mock("@/lib/semo-db", () => ({
  querySemoDb: vi.fn(),
}));

import { querySemoDb } from "@/lib/semo-db";

const mockQuerySemoDb = vi.mocked(querySemoDb);

describe("SemoStatsRepository", () => {
  let repository: SemoStatsRepository;

  beforeEach(() => {
    repository = new SemoStatsRepository();
    vi.clearAllMocks();
  });

  describe("getOverview", () => {
    it("현재 기간과 이전 기간의 통계를 조회하여 개요를 반환한다", async () => {
      // Arrange
      mockQuerySemoDb
        .mockResolvedValueOnce({
          rows: [{ total_interactions: "100", active_users: "5" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_interactions: "80", active_users: "4" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_memories: "50" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_memories: "40" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        });

      // Act
      const result = await repository.getOverview({ range: "7d" });

      // Assert
      expect(result).toMatchObject({
        totalInteractions: 100,
        activeUsers: 5,
        totalMemories: 50,
      });
      expect(result.interactionsChange).toBe(25); // (100-80)/80 * 100 = 25%
      expect(result.usersChange).toBe(25); // (5-4)/4 * 100 = 25%
      expect(result.memoriesChange).toBe(25); // (50-40)/40 * 100 = 25%
      expect(mockQuerySemoDb).toHaveBeenCalledTimes(4);
    });

    it("이전 기간 데이터가 0일 때 100% 증가로 계산한다", async () => {
      // Arrange
      mockQuerySemoDb
        .mockResolvedValueOnce({
          rows: [{ total_interactions: "50", active_users: "3" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_interactions: "0", active_users: "0" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_memories: "20" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [{ total_memories: "0" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        });

      // Act
      const result = await repository.getOverview({ range: "30d" });

      // Assert
      expect(result.interactionsChange).toBe(100);
      expect(result.usersChange).toBe(100);
      expect(result.memoriesChange).toBe(100);
    });
  });

  describe("getSkillUsage", () => {
    it("스킬 사용 빈도를 내림차순으로 반환한다", async () => {
      // Arrange
      mockQuerySemoDb.mockResolvedValueOnce({
        rows: [
          { skill_name: "slack_send_message", count: "10" },
          { skill_name: "github_create_issue", count: "5" },
          { skill_name: "semo_orchestrate", count: "3" },
        ],
        rowCount: 3,
        command: "SELECT",
        oid: 0,
        fields: [],
      });

      // Act
      const result = await repository.getSkillUsage({ range: "7d" });

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        skillName: "slack_send_message",
        count: 10,
        percentage: 56, // 10/18 * 100 ≈ 56%
      });
      expect(result[1]).toEqual({
        skillName: "github_create_issue",
        count: 5,
        percentage: 28, // 5/18 * 100 ≈ 28%
      });
    });

    it("스킬 데이터가 없으면 빈 배열을 반환한다", async () => {
      // Arrange
      mockQuerySemoDb.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: "SELECT",
        oid: 0,
        fields: [],
      });

      // Act
      const result = await repository.getSkillUsage({ range: "7d" });

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("getUsageTrend", () => {
    it("일별 사용 추이를 날짜순으로 반환한다", async () => {
      // Arrange
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");

      mockQuerySemoDb
        .mockResolvedValueOnce({
          rows: [
            { date: date1, interactions: "20" },
            { date: date2, interactions: "30" },
          ],
          rowCount: 2,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [
            { date: date1, memories: "5" },
            { date: date2, memories: "8" },
          ],
          rowCount: 2,
          command: "SELECT",
          oid: 0,
          fields: [],
        });

      // Act
      const result = await repository.getUsageTrend({ range: "7d" });

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        date: "2024-01-01",
        interactions: 20,
        memories: 5,
      });
      expect(result[1]).toEqual({
        date: "2024-01-02",
        interactions: 30,
        memories: 8,
      });
    });

    it("interactions만 있고 memories가 없는 날짜도 처리한다", async () => {
      // Arrange
      const date1 = new Date("2024-01-01");

      mockQuerySemoDb
        .mockResolvedValueOnce({
          rows: [{ date: date1, interactions: "15" }],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [],
          rowCount: 0,
          command: "SELECT",
          oid: 0,
          fields: [],
        });

      // Act
      const result = await repository.getUsageTrend({ range: "7d" });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        date: "2024-01-01",
        interactions: 15,
        memories: 0,
      });
    });
  });

  describe("getMemberStats", () => {
    it("팀원별 통계를 총 사용량 내림차순으로 반환한다", async () => {
      // Arrange
      const lastActive = new Date("2024-01-15T10:00:00Z");

      mockQuerySemoDb
        .mockResolvedValueOnce({
          rows: [
            {
              user_id: "user-1234-5678-abcd",
              total_interactions: "50",
              last_active_at: lastActive,
            },
          ],
          rowCount: 1,
          command: "SELECT",
          oid: 0,
          fields: [],
        })
        .mockResolvedValueOnce({
          rows: [
            { user_id: "user-1234-5678-abcd", skill_name: "coder" },
            { user_id: "user-1234-5678-abcd", skill_name: "spec" },
            { user_id: "user-1234-5678-abcd", skill_name: "implement" },
          ],
          rowCount: 3,
          command: "SELECT",
          oid: 0,
          fields: [],
        });

      // Act
      const result = await repository.getMemberStats({ range: "30d" });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        userId: "user-1234-5678-abcd",
        displayName: "user-123", // UUID 앞 8자리
        totalInteractions: 50,
        topSkills: ["coder", "spec", "implement"],
      });
    });
  });

  describe("getMemoryTypes", () => {
    it("메모리 유형별 통계를 반환한다", async () => {
      // Arrange
      mockQuerySemoDb.mockResolvedValueOnce({
        rows: [
          { memory_type: "episodic", count: "30" },
          { memory_type: "semantic", count: "20" },
          { memory_type: "procedural", count: "10" },
        ],
        rowCount: 3,
        command: "SELECT",
        oid: 0,
        fields: [],
      });

      // Act
      const result = await repository.getMemoryTypes({ range: "30d" });

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        type: "episodic",
        count: 30,
        percentage: 50, // 30/60 * 100 = 50%
      });
      expect(result[1]).toEqual({
        type: "semantic",
        count: 20,
        percentage: 33, // 20/60 * 100 ≈ 33%
      });
    });

    it("unknown 타입은 필터링한다", async () => {
      // Arrange
      mockQuerySemoDb.mockResolvedValueOnce({
        rows: [
          { memory_type: "unknown", count: "5" },
          { memory_type: "episodic", count: "10" },
        ],
        rowCount: 2,
        command: "SELECT",
        oid: 0,
        fields: [],
      });

      // Act
      const result = await repository.getMemoryTypes({ range: "7d" });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("episodic");
    });
  });

  describe("getStats", () => {
    it("모든 통계를 병렬로 조회하여 통합 응답을 반환한다", async () => {
      // Arrange - 헬퍼 함수로 모킹 간소화
      const emptyResult = { rows: [], rowCount: 0, command: "SELECT", oid: 0, fields: [] };
      const mockRows = (rows: unknown[]) => ({ ...emptyResult, rows, rowCount: rows.length });

      // getOverview(4) + getSkillUsage(1) + getUsageTrend(2) + getMemberStats(2) + getMemoryTypes(1)
      mockQuerySemoDb
        .mockResolvedValueOnce(mockRows([{ total_interactions: "100", active_users: "5" }]))
        .mockResolvedValueOnce(mockRows([{ total_interactions: "80", active_users: "4" }]))
        .mockResolvedValueOnce(mockRows([{ total_memories: "50" }]))
        .mockResolvedValueOnce(mockRows([{ total_memories: "40" }]))
        .mockResolvedValueOnce(mockRows([{ skill_name: "coder", count: "10" }]))
        .mockResolvedValueOnce(emptyResult)
        .mockResolvedValueOnce(emptyResult)
        .mockResolvedValueOnce(emptyResult)
        .mockResolvedValueOnce(emptyResult)
        .mockResolvedValueOnce(emptyResult);

      // Act
      const result = await repository.getStats({ range: "30d" });

      // Assert
      expect(result).toHaveProperty("overview");
      expect(result).toHaveProperty("skillUsage");
      expect(result).toHaveProperty("usageTrend");
      expect(result).toHaveProperty("memberStats");
      expect(result).toHaveProperty("memoryTypes");
      expect(result.dateRange).toEqual({ range: "30d" });
    });
  });
});
