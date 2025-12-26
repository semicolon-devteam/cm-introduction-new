/**
 * Next.js API Implementation for SEMO Stats Service
 */

import type {
  ISemoStatsService,
  DateRangeParams,
  SemoStatsResponse,
  SemoStatsOverview,
  SkillUsageStat,
  UsageTrend,
  MemberStat,
} from "../interfaces/semo-stats.interface";

export class NextSemoStatsService implements ISemoStatsService {
  private readonly baseUrl = "/api/admin/semo-stats";

  private buildUrl(params: DateRangeParams): string {
    const searchParams = new URLSearchParams();
    searchParams.set("range", params.range);
    if (params.startDate) searchParams.set("startDate", params.startDate);
    if (params.endDate) searchParams.set("endDate", params.endDate);
    return `${this.baseUrl}?${searchParams.toString()}`;
  }

  async getStats(params: DateRangeParams): Promise<SemoStatsResponse> {
    const response = await fetch(this.buildUrl(params));
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }
    return response.json();
  }

  async getOverview(params: DateRangeParams): Promise<SemoStatsOverview> {
    const stats = await this.getStats(params);
    return stats.overview;
  }

  async getSkillUsage(params: DateRangeParams): Promise<SkillUsageStat[]> {
    const stats = await this.getStats(params);
    return stats.skillUsage;
  }

  async getUsageTrend(params: DateRangeParams): Promise<UsageTrend[]> {
    const stats = await this.getStats(params);
    return stats.usageTrend;
  }

  async getMemberStats(params: DateRangeParams): Promise<MemberStat[]> {
    const stats = await this.getStats(params);
    return stats.memberStats;
  }
}
