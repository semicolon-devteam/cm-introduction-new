/**
 * SEMO Stats Repository
 *
 * PostgreSQL (팀 중앙 DB)에서 SEMO 통계 데이터 조회
 */

import { querySemoDb } from "@/lib/semo-db";

import type {
  DateRangeParams,
  SemoStatsOverview,
  SkillUsageStat,
  UsageTrend,
  MemberStat,
  MemoryTypeStat,
  SemoStatsResponse,
} from "../_api-clients/interfaces/semo-stats.interface";

export class SemoStatsRepository {
  /**
   * 날짜 범위를 SQL 조건으로 변환
   */
  private getDateCondition(params: DateRangeParams): {
    startDate: Date;
    endDate: Date;
  } {
    const endDate = new Date();
    let startDate: Date;

    switch (params.range) {
      case "7d":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        startDate = params.startDate
          ? new Date(params.startDate)
          : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (params.endDate) {
          endDate.setTime(new Date(params.endDate).getTime());
        }
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate };
  }

  /**
   * 이전 기간 날짜 범위 계산 (증감률 계산용)
   */
  private getPreviousPeriod(
    startDate: Date,
    endDate: Date
  ): { prevStartDate: Date; prevEndDate: Date } {
    const duration = endDate.getTime() - startDate.getTime();
    const prevEndDate = new Date(startDate.getTime() - 1);
    const prevStartDate = new Date(prevEndDate.getTime() - duration);
    return { prevStartDate, prevEndDate };
  }

  /**
   * 전체 통계 조회
   */
  async getStats(params: DateRangeParams): Promise<SemoStatsResponse> {
    const [overview, skillUsage, usageTrend, memberStats, memoryTypes] =
      await Promise.all([
        this.getOverview(params),
        this.getSkillUsage(params),
        this.getUsageTrend(params),
        this.getMemberStats(params),
        this.getMemoryTypes(params),
      ]);

    return {
      overview,
      skillUsage,
      usageTrend,
      memberStats,
      memoryTypes,
      dateRange: params,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * 개요 통계 조회
   */
  async getOverview(params: DateRangeParams): Promise<SemoStatsOverview> {
    const { startDate, endDate } = this.getDateCondition(params);
    const { prevStartDate, prevEndDate } = this.getPreviousPeriod(
      startDate,
      endDate
    );

    // 현재 기간 통계
    const currentQuery = `
      SELECT
        COUNT(*) as total_interactions,
        COUNT(DISTINCT user_id) as active_users
      FROM semo.interaction_logs
      WHERE created_at >= $1 AND created_at <= $2
    `;

    // 이전 기간 통계 (증감률 계산용)
    const prevQuery = `
      SELECT
        COUNT(*) as total_interactions,
        COUNT(DISTINCT user_id) as active_users
      FROM semo.interaction_logs
      WHERE created_at >= $1 AND created_at <= $2
    `;

    // 메모리 통계
    const memoryQuery = `
      SELECT COUNT(*) as total_memories
      FROM semo.semantic_memory
      WHERE created_at >= $1 AND created_at <= $2
    `;

    const prevMemoryQuery = `
      SELECT COUNT(*) as total_memories
      FROM semo.semantic_memory
      WHERE created_at >= $1 AND created_at <= $2
    `;

    const [currentResult, prevResult, memoryResult, prevMemoryResult] =
      await Promise.all([
        querySemoDb(currentQuery, [startDate, endDate]),
        querySemoDb(prevQuery, [prevStartDate, prevEndDate]),
        querySemoDb(memoryQuery, [startDate, endDate]),
        querySemoDb(prevMemoryQuery, [prevStartDate, prevEndDate]),
      ]);

    const current = currentResult.rows[0] as {
      total_interactions: string;
      active_users: string;
    };
    const prev = prevResult.rows[0] as {
      total_interactions: string;
      active_users: string;
    };
    const memory = memoryResult.rows[0] as { total_memories: string };
    const prevMemory = prevMemoryResult.rows[0] as { total_memories: string };

    const totalInteractions = parseInt(current.total_interactions, 10) || 0;
    const prevInteractions = parseInt(prev.total_interactions, 10) || 0;
    const activeUsers = parseInt(current.active_users, 10) || 0;
    const prevUsers = parseInt(prev.active_users, 10) || 0;
    const totalMemories = parseInt(memory.total_memories, 10) || 0;
    const prevMemories = parseInt(prevMemory.total_memories, 10) || 0;

    // 일평균 계산
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const dailyAverage = days > 0 ? totalInteractions / days : 0;
    const prevDays = Math.ceil(
      (prevEndDate.getTime() - prevStartDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const prevDailyAverage = prevDays > 0 ? prevInteractions / prevDays : 0;

    // 증감률 계산
    const calcChange = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    return {
      totalInteractions,
      activeUsers,
      dailyAverage: Math.round(dailyAverage * 10) / 10,
      totalMemories,
      interactionsChange: calcChange(totalInteractions, prevInteractions),
      usersChange: calcChange(activeUsers, prevUsers),
      dailyAverageChange: calcChange(dailyAverage, prevDailyAverage),
      memoriesChange: calcChange(totalMemories, prevMemories),
    };
  }

  /**
   * 스킬 사용 통계 조회 (상위 10개)
   */
  async getSkillUsage(params: DateRangeParams): Promise<SkillUsageStat[]> {
    const { startDate, endDate } = this.getDateCondition(params);

    const query = `
      SELECT
        skill_name,
        COUNT(*) as count
      FROM semo.interaction_logs
      WHERE skill_name IS NOT NULL
        AND skill_name != ''
        AND created_at >= $1
        AND created_at <= $2
      GROUP BY skill_name
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await querySemoDb(query, [startDate, endDate]);

    // 전체 합계 계산
    const total = result.rows.reduce(
      (sum, row) => sum + parseInt((row as { count: string }).count, 10),
      0
    );

    return result.rows.map((row) => {
      const r = row as { skill_name: string; count: string };
      const count = parseInt(r.count, 10);
      return {
        skillName: r.skill_name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }

  /**
   * 사용 추이 조회 (일별)
   */
  async getUsageTrend(params: DateRangeParams): Promise<UsageTrend[]> {
    const { startDate, endDate } = this.getDateCondition(params);

    const query = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as interactions
      FROM semo.interaction_logs
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const memoryQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as memories
      FROM semo.semantic_memory
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const [interactionsResult, memoriesResult] = await Promise.all([
      querySemoDb(query, [startDate, endDate]),
      querySemoDb(memoryQuery, [startDate, endDate]),
    ]);

    // 날짜별 데이터 병합
    const dateMap = new Map<string, UsageTrend>();

    interactionsResult.rows.forEach((row) => {
      const r = row as { date: Date; interactions: string };
      const dateStr = r.date.toISOString().split("T")[0];
      dateMap.set(dateStr, {
        date: dateStr,
        interactions: parseInt(r.interactions, 10),
        memories: 0,
      });
    });

    memoriesResult.rows.forEach((row) => {
      const r = row as { date: Date; memories: string };
      const dateStr = r.date.toISOString().split("T")[0];
      const existing = dateMap.get(dateStr);
      if (existing) {
        existing.memories = parseInt(r.memories, 10);
      } else {
        dateMap.set(dateStr, {
          date: dateStr,
          interactions: 0,
          memories: parseInt(r.memories, 10),
        });
      }
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * 팀원별 통계 조회
   */
  async getMemberStats(params: DateRangeParams): Promise<MemberStat[]> {
    const { startDate, endDate } = this.getDateCondition(params);

    // 팀원별 통계 조회
    const query = `
      SELECT
        user_id,
        COUNT(*) as total_interactions,
        MAX(created_at) as last_active_at,
        ARRAY_AGG(DISTINCT skill_name) FILTER (WHERE skill_name IS NOT NULL) as skills
      FROM semo.interaction_logs
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY user_id
      ORDER BY total_interactions DESC
    `;

    const result = await querySemoDb(query, [startDate, endDate]);

    // 스킬 사용 빈도별 Top 3 조회
    const topSkillsQuery = `
      SELECT
        user_id,
        skill_name,
        COUNT(*) as count
      FROM semo.interaction_logs
      WHERE skill_name IS NOT NULL
        AND created_at >= $1
        AND created_at <= $2
      GROUP BY user_id, skill_name
      ORDER BY user_id, count DESC
    `;

    const topSkillsResult = await querySemoDb(topSkillsQuery, [
      startDate,
      endDate,
    ]);

    // 사용자별 Top 3 스킬 매핑
    const userTopSkills = new Map<string, string[]>();
    topSkillsResult.rows.forEach((row) => {
      const r = row as { user_id: string; skill_name: string };
      const skills = userTopSkills.get(r.user_id) || [];
      if (skills.length < 3) {
        skills.push(r.skill_name);
        userTopSkills.set(r.user_id, skills);
      }
    });

    return result.rows.map((row) => {
      const r = row as {
        user_id: string;
        total_interactions: string;
        last_active_at: Date;
      };
      return {
        userId: r.user_id,
        displayName: r.user_id.substring(0, 8), // UUID 앞 8자리
        totalInteractions: parseInt(r.total_interactions, 10),
        topSkills: userTopSkills.get(r.user_id) || [],
        lastActiveAt: r.last_active_at.toISOString(),
      };
    });
  }

  /**
   * 메모리 유형별 통계 조회
   */
  async getMemoryTypes(params: DateRangeParams): Promise<MemoryTypeStat[]> {
    const { startDate, endDate } = this.getDateCondition(params);

    const query = `
      SELECT
        COALESCE(memory_type, 'unknown') as memory_type,
        COUNT(*) as count
      FROM semo.semantic_memory
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY memory_type
      ORDER BY count DESC
    `;

    const result = await querySemoDb(query, [startDate, endDate]);

    const total = result.rows.reduce(
      (sum, row) => sum + parseInt((row as { count: string }).count, 10),
      0
    );

    const validTypes = ["episodic", "semantic", "procedural"];

    return result.rows
      .filter((row) =>
        validTypes.includes((row as { memory_type: string }).memory_type)
      )
      .map((row) => {
        const r = row as { memory_type: string; count: string };
        const count = parseInt(r.count, 10);
        return {
          type: r.memory_type as "episodic" | "semantic" | "procedural",
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      });
  }
}
