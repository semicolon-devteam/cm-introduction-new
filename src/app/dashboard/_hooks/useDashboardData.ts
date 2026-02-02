/* eslint-disable max-lines, @typescript-eslint/no-floating-promises */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  CalendarEvent,
  GitHubIssue,
  KPIMetric,
  MilestoneItem,
  GoalItem,
  OperationsData,
  POData,
  IncidentItem,
  TaskItem,
  PeriodFilter,
  ProjectRevenue,
} from "../_components/types";

// 로컬스토리지 키
const STORAGE_KEYS = {
  MILESTONES: "dashboard_milestones",
  GOALS: "dashboard_goals",
  REVENUE: "dashboard_revenue",
  OPERATIONS: "dashboard_operations",
  PO_DATA: "dashboard_po_data",
} as const;

// 수익 데이터 타입
interface RevenueData {
  currentRevenue: number;
  targetRevenue: number;
  monthlyData: Array<{
    month: string;
    current: number;
    target: number;
  }>;
  projectRevenues?: ProjectRevenue[];
}

// 대시보드 데이터 타입
interface DashboardData {
  milestones: MilestoneItem[];
  goals: GoalItem[];
  revenue: RevenueData;
  operations: OperationsData;
  poData: POData;
  githubIssues: GitHubIssue[];
  githubConnected: boolean;
  githubProjectTitle?: string;
  githubItemCount?: number;
}

// 기본 수익 데이터
const defaultRevenue: RevenueData = {
  currentRevenue: 0,
  targetRevenue: 0,
  monthlyData: [],
};

// 기본 운영 데이터
const defaultOperations: OperationsData = {
  serviceStatus: "operational",
  incidents: [],
  infraChanges: [],
  metrics: {
    uptime: "",
    responseTime: "",
    errorRate: "",
    activeUsers: "",
  },
  notes: "",
};

// 기본 PO 데이터
const defaultPOData: POData = {
  spending: "",
  completedTasks: [],
  inProgressTasks: [],
  blockers: [],
  nextWeekPlan: [],
};

// 로컬스토리지 헬퍼
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("로컬스토리지 저장 실패:", error);
  }
}

// 마일스톤을 달력 이벤트로 변환
function milestonesToEvents(milestones: MilestoneItem[]): CalendarEvent[] {
  return milestones.map((m) => ({
    id: `milestone-${m.id}`,
    type: "milestone" as const,
    title: m.title,
    date: m.date,
    status:
      m.status === "achieved"
        ? "달성"
        : m.status === "in_progress"
          ? "진행중"
          : m.status === "delayed"
            ? "지연"
            : "예정",
    color: "emerald",
    metadata: m,
  }));
}

// 목표를 달력 이벤트로 변환
function goalsToEvents(goals: GoalItem[]): CalendarEvent[] {
  return goals
    .filter((g) => g.deadline) // deadline이 있는 것만
    .map((g) => ({
      id: `goal-${g.id}`,
      type: "goal" as const,
      title: g.title,
      date: g.deadline,
      status:
        g.status === "achieved"
          ? "달성"
          : g.status === "in_progress"
            ? "진행중"
            : g.status === "at_risk"
              ? "위험"
              : "시작 전",
      color: "amber",
      metadata: g,
    }));
}

// GitHub 이슈를 달력 이벤트로 변환
function issuesToEvents(issues: GitHubIssue[]): CalendarEvent[] {
  return issues.map((issue) => ({
    id: `issue-${issue.id}`,
    type: "github_issue" as const,
    title: issue.title,
    date: issue.created_at.split("T")[0], // 생성일 기준
    status: issue.state,
    color: "red",
    metadata: issue,
  }));
}

// KPI 계산 - GitHub 이슈 중심 + 목표/수익 통합
function calculateKPIs(data: DashboardData): KPIMetric[] {
  // GitHub 이슈 통계
  const totalIssues = data.githubIssues.length;
  const openIssues = data.githubIssues.filter((i) => i.state === "open").length;

  // 레포지토리별 이슈 수
  const landIssues = data.githubIssues.filter((i) => i.repository === "cm-land").length;
  const officeIssues = data.githubIssues.filter((i) => i.repository === "cm-office").length;
  const jungchipanIssues = data.githubIssues.filter((i) => i.repository === "cm-jungchipan").length;

  // 목표 통계
  const totalGoals = data.goals.length;
  const achievedGoals = data.goals.filter((g) => g.status === "achieved").length;
  const atRiskGoals = data.goals.filter((g) => g.status === "at_risk").length;
  const inProgressGoals = data.goals.filter((g) => g.status === "in_progress").length;

  // 수익 진행률
  const revenueProgress =
    data.revenue.targetRevenue > 0
      ? Math.round((data.revenue.currentRevenue / data.revenue.targetRevenue) * 100)
      : 0;

  return [
    {
      id: "total-bugs",
      label: "전체 버그",
      value: totalIssues,
      unit: "건",
      trend: totalIssues > 10 ? "down" : totalIssues > 5 ? "neutral" : "up",
      color: "red",
    },
    {
      id: "land-bugs",
      label: "랜드",
      value: landIssues,
      unit: "건",
      trend: landIssues > 5 ? "down" : "neutral",
      color: "emerald",
    },
    {
      id: "office-bugs",
      label: "오피스",
      value: officeIssues,
      unit: "건",
      trend: officeIssues > 5 ? "down" : "neutral",
      color: "blue",
    },
    {
      id: "jungchipan-bugs",
      label: "중개판",
      value: jungchipanIssues,
      unit: "건",
      trend: jungchipanIssues > 5 ? "down" : "neutral",
      color: "purple",
    },
  ];
}

// 확장 KPI 계산 - 목표/수익 포함
function calculateExtendedKPIs(data: DashboardData): KPIMetric[] {
  const totalGoals = data.goals.length;
  const achievedGoals = data.goals.filter((g) => g.status === "achieved").length;
  const atRiskGoals = data.goals.filter((g) => g.status === "at_risk").length;
  const achievedRate = totalGoals > 0 ? Math.round((achievedGoals / totalGoals) * 100) : 0;

  const revenueProgress =
    data.revenue.targetRevenue > 0
      ? Math.round((data.revenue.currentRevenue / data.revenue.targetRevenue) * 100)
      : 0;

  return [
    {
      id: "total-goals",
      label: "목표",
      value: totalGoals,
      unit: "개",
      trend: "neutral" as const,
      color: "brand-primary",
    },
    {
      id: "achieved-goals",
      label: "달성",
      value: achievedGoals,
      unit: "개",
      trend: achievedGoals > 0 ? "up" : "neutral",
      color: "emerald",
    },
    {
      id: "at-risk-goals",
      label: "위험",
      value: atRiskGoals,
      unit: "개",
      trend: atRiskGoals > 0 ? "down" : "up",
      color: "red",
    },
    {
      id: "revenue-progress",
      label: "매출 진행률",
      value: revenueProgress,
      target: 100,
      unit: "%",
      trend: revenueProgress >= 70 ? "up" : revenueProgress >= 30 ? "neutral" : "down",
      color: "blue",
    },
  ];
}

// 목표 진행 데이터 계산
function calculateGoalProgress(goals: GoalItem[]) {
  const categories = ["revenue", "user", "performance", "feature", "other"] as const;

  return categories
    .map((category) => {
      const categoryGoals = goals.filter((g) => g.category === category);
      const achieved = categoryGoals.filter((g) => g.status === "achieved").length;
      const total = categoryGoals.length;
      const percentage = total > 0 ? Math.round((achieved / total) * 100) : 0;

      return { category, achieved, total, percentage };
    })
    .filter((item) => item.total > 0); // 목표가 있는 카테고리만
}

export function useDashboardData(period: PeriodFilter = "month") {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    milestones: [],
    goals: [],
    revenue: defaultRevenue,
    operations: defaultOperations,
    poData: defaultPOData,
    githubIssues: [],
    githubConnected: false,
  });

  // 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 로컬스토리지에서 데이터 로드
      const milestones = getFromStorage<MilestoneItem[]>(STORAGE_KEYS.MILESTONES, []);
      const goals = getFromStorage<GoalItem[]>(STORAGE_KEYS.GOALS, []);
      const revenue = getFromStorage<RevenueData>(STORAGE_KEYS.REVENUE, defaultRevenue);
      const operations = getFromStorage<OperationsData>(STORAGE_KEYS.OPERATIONS, defaultOperations);
      const poData = getFromStorage<POData>(STORAGE_KEYS.PO_DATA, defaultPOData);

      // API에서 GitHub Project 데이터 로드
      let githubIssues: GitHubIssue[] = [];
      let githubConnected = false;
      let githubProjectTitle: string | undefined;
      let githubItemCount: number | undefined;

      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            githubConnected = result.data.github?.connected || false;
            githubProjectTitle = result.data.github?.projectTitle;
            githubItemCount = result.data.github?.itemCount;
            githubIssues = result.data.github?.issues || [];
          }
        }
      } catch (apiError) {
        console.error("API 호출 실패:", apiError);
        // API 실패해도 로컬 데이터는 사용
      }

      setData({
        milestones,
        goals,
        revenue,
        operations,
        poData,
        githubIssues,
        githubConnected,
        githubProjectTitle,
        githubItemCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 로드 실패");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 마일스톤 저장
  const saveMilestones = useCallback((milestones: MilestoneItem[]) => {
    setToStorage(STORAGE_KEYS.MILESTONES, milestones);
    setData((prev) => ({ ...prev, milestones }));
  }, []);

  // 목표 저장
  const saveGoals = useCallback((goals: GoalItem[]) => {
    setToStorage(STORAGE_KEYS.GOALS, goals);
    setData((prev) => ({ ...prev, goals }));
  }, []);

  // 수익 데이터 저장
  const saveRevenue = useCallback((revenue: RevenueData) => {
    setToStorage(STORAGE_KEYS.REVENUE, revenue);
    setData((prev) => ({ ...prev, revenue }));
  }, []);

  // 운영 데이터 저장
  const saveOperations = useCallback((operations: OperationsData) => {
    setToStorage(STORAGE_KEYS.OPERATIONS, operations);
    setData((prev) => ({ ...prev, operations }));
  }, []);

  // PO 데이터 저장
  const savePOData = useCallback((poData: POData) => {
    setToStorage(STORAGE_KEYS.PO_DATA, poData);
    setData((prev) => ({ ...prev, poData }));
  }, []);

  // 이슈 새로고침 (캐시 무시)
  const refreshIssues = useCallback(async () => {
    try {
      // refresh=true 파라미터로 캐시 무시
      const response = await fetch("/api/dashboard?refresh=true");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.github?.issues) {
          setData((prev) => ({
            ...prev,
            githubIssues: result.data.github.issues,
            githubConnected: result.data.github.connected,
            githubProjectTitle: result.data.github.projectTitle,
            githubItemCount: result.data.github.itemCount,
          }));
        }
      }
    } catch (err) {
      console.error("이슈 새로고침 실패:", err);
    }
  }, []);

  // 기간에 따른 날짜 범위
  const dateRange = useMemo(() => getDateRangeForPeriod(period), [period]);

  // 기간 필터링된 GitHub 이슈
  const filteredIssues = useMemo(() => {
    return data.githubIssues.filter((issue) =>
      isDateInRange(issue.updated_at, dateRange.start, dateRange.end),
    );
  }, [data.githubIssues, dateRange]);

  // 기간 필터링된 마일스톤
  const filteredMilestones = useMemo(() => {
    return data.milestones.filter((m) => isDateInRange(m.date, dateRange.start, dateRange.end));
  }, [data.milestones, dateRange]);

  // 기간 필터링된 목표
  const filteredGoals = useMemo(() => {
    return data.goals.filter(
      (g) => g.deadline && isDateInRange(g.deadline, dateRange.start, dateRange.end),
    );
  }, [data.goals, dateRange]);

  // 계산된 데이터 (필터링된 데이터 사용)
  const calendarEvents: CalendarEvent[] = [
    ...milestonesToEvents(filteredMilestones),
    ...goalsToEvents(filteredGoals),
    ...issuesToEvents(filteredIssues),
  ];

  // KPI는 필터링된 이슈 수 사용
  const filteredData: DashboardData = {
    ...data,
    githubIssues: filteredIssues,
    milestones: filteredMilestones,
    goals: filteredGoals,
  };
  const kpiMetrics = calculateKPIs(filteredData);
  const extendedKPIs = calculateExtendedKPIs(data); // 전체 데이터 기준 목표/수익 KPI
  const goalProgress = calculateGoalProgress(filteredGoals);

  // 매출 트렌드 데이터
  const revenueData =
    data.revenue.monthlyData.length > 0
      ? data.revenue.monthlyData
      : generateDefaultRevenueData(data.revenue.currentRevenue, data.revenue.targetRevenue);

  return {
    isLoading,
    error,
    data,
    filteredData,
    calendarEvents,
    kpiMetrics,
    extendedKPIs,
    goalProgress,
    revenueData,
    dateRange,
    period,
    totalIssueCount: data.githubIssues.length,
    filteredIssueCount: filteredIssues.length,
    saveMilestones,
    saveGoals,
    saveRevenue,
    saveOperations,
    savePOData,
    refreshIssues,
    reload: loadData,
  };
}

// 기간 필터에 따른 날짜 범위 계산
function getDateRangeForPeriod(period: PeriodFilter): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (period) {
    case "week":
      // 이번 주 (일요일부터 토요일)
      const dayOfWeek = now.getDay();
      start.setDate(now.getDate() - dayOfWeek);
      end.setDate(start.getDate() + 6);
      break;
    case "month":
      // 이번 달
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // 이번 달 마지막 날
      break;
    case "quarter":
      // 이번 분기
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      start.setMonth(quarterMonth);
      start.setDate(1);
      end.setMonth(quarterMonth + 3);
      end.setDate(0); // 분기 마지막 날
      break;
  }

  return { start, end };
}

// 날짜가 범위 내에 있는지 확인
function isDateInRange(dateStr: string, start: Date, end: Date): boolean {
  const date = new Date(dateStr);
  return date >= start && date <= end;
}

// 기본 매출 트렌드 데이터 생성 (최근 6개월)
function generateDefaultRevenueData(current: number, target: number) {
  const months = ["8월", "9월", "10월", "11월", "12월", "1월"];
  const now = new Date();
  const currentMonth = now.getMonth();

  return months.map((month, index) => {
    // 현재 달까지는 점진적 증가, 이후는 목표에 맞춰 예측
    const progress = (index + 1) / months.length;
    const estimatedCurrent = Math.round(current * progress);
    const estimatedTarget = Math.round(target * progress);

    return {
      month,
      current: index <= currentMonth ? estimatedCurrent : 0,
      target: estimatedTarget,
    };
  });
}

export type { DashboardData, RevenueData };
