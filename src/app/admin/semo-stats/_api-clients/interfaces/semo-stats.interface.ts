/**
 * SEMO Stats Service Interface
 *
 * SEMO 사용 통계 조회 서비스
 */

// 기간 범위
export type DateRange = "7d" | "30d" | "90d" | "custom";

export interface DateRangeParams {
  range: DateRange;
  startDate?: string; // ISO date string (custom일 때)
  endDate?: string; // ISO date string (custom일 때)
}

// 통계 개요
export interface SemoStatsOverview {
  totalInteractions: number;
  activeUsers: number;
  dailyAverage: number;
  totalMemories: number;
  // 증감률 (이전 기간 대비 %)
  interactionsChange: number;
  usersChange: number;
  dailyAverageChange: number;
  memoriesChange: number;
}

// 스킬 사용 통계
export interface SkillUsageStat {
  skillName: string;
  count: number;
  percentage: number;
}

// 사용 추이 (일별)
export interface UsageTrend {
  date: string; // ISO date string
  interactions: number;
  memories: number;
}

// 팀원별 통계
export interface MemberStat {
  userId: string;
  displayName: string; // 표시 이름 (UUID 앞 8자리 또는 별칭)
  totalInteractions: number;
  topSkills: string[];
  lastActiveAt: string; // ISO datetime string
}

// 메모리 유형별 통계
export interface MemoryTypeStat {
  type: "episodic" | "semantic" | "procedural";
  count: number;
  percentage: number;
}

// API 응답 타입
export interface SemoStatsResponse {
  overview: SemoStatsOverview;
  skillUsage: SkillUsageStat[];
  usageTrend: UsageTrend[];
  memberStats: MemberStat[];
  memoryTypes: MemoryTypeStat[];
  dateRange: DateRangeParams;
  generatedAt: string;
}

// 서비스 인터페이스
export interface ISemoStatsService {
  /**
   * 전체 통계 조회
   */
  getStats(params: DateRangeParams): Promise<SemoStatsResponse>;

  /**
   * 개요 통계만 조회
   */
  getOverview(params: DateRangeParams): Promise<SemoStatsOverview>;

  /**
   * 스킬 사용 통계 조회
   */
  getSkillUsage(params: DateRangeParams): Promise<SkillUsageStat[]>;

  /**
   * 사용 추이 조회
   */
  getUsageTrend(params: DateRangeParams): Promise<UsageTrend[]>;

  /**
   * 팀원별 통계 조회
   */
  getMemberStats(params: DateRangeParams): Promise<MemberStat[]>;
}
