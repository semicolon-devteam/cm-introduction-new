/**
 * 프로젝트 타입 (3개 레포지토리)
 */
export type ProjectType = "cm-land" | "cm-office" | "cm-jungchipan" | "all";

export const PROJECT_INFO: Record<Exclude<ProjectType, "all">, { label: string; color: string; bg: string; border: string }> = {
  "cm-land": { label: "랜드", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40" },
  "cm-office": { label: "오피스", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/40" },
  "cm-jungchipan": { label: "중개판", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/40" },
};

/**
 * 마일스톤 아이템 타입 (로컬 정의)
 */
export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  targetRevenue: string;
  description: string;
  status: "planned" | "in_progress" | "achieved" | "delayed";
  project?: Exclude<ProjectType, "all">;
}

/**
 * 목표 아이템 타입 (로컬 정의)
 */
export interface GoalItem {
  id: string;
  category: "revenue" | "user" | "performance" | "feature" | "other";
  title: string;
  currentValue: string;
  targetValue: string;
  unit: string;
  deadline: string;
  status: "not_started" | "in_progress" | "achieved" | "at_risk";
  project?: Exclude<ProjectType, "all">;
}

/**
 * 프로젝트별 수익 데이터
 */
export interface ProjectRevenue {
  project: Exclude<ProjectType, "all">;
  currentRevenue: number;
  targetRevenue: number;
  monthlyData: MonthlyRevenue[];
}

/**
 * 월별 수익 데이터
 */
export interface MonthlyRevenue {
  month: string;
  current: number;
  target: number;
}

/**
 * GitHub 이슈 타입 (프로젝트 보드 연동)
 */
export interface GitHubIssue {
  id: number | string;
  number: number | null;
  title: string;
  state: "open" | "closed" | string;
  html_url: string | null;
  created_at: string;
  updated_at: string;
  // 프로젝트 보드 필드
  status: string | null;
  priority: string | null;
  repository: string | null;
  type: "ISSUE" | "DRAFT_ISSUE" | "PULL_REQUEST" | string;
  assignees: string[];
  labels: Array<{
    id: number | string;
    name: string;
    color: string;
  }>;
}

/**
 * 프로젝트 Status 색상
 */
export const PROJECT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Todo": { bg: "bg-gray-500/20", text: "text-gray-400" },
  "Backlog": { bg: "bg-gray-500/20", text: "text-gray-400" },
  "In Progress": { bg: "bg-blue-500/20", text: "text-blue-400" },
  "In Review": { bg: "bg-purple-500/20", text: "text-purple-400" },
  "Done": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  "Blocked": { bg: "bg-red-500/20", text: "text-red-400" },
};

/**
 * 프로젝트 Priority 색상
 */
export const PROJECT_PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  "High": { bg: "bg-red-500/20", text: "text-red-400" },
  "Medium": { bg: "bg-amber-500/20", text: "text-amber-400" },
  "Low": { bg: "bg-blue-500/20", text: "text-blue-400" },
};

/**
 * 달력 이벤트 타입
 */
export type CalendarEventType = 'milestone' | 'goal' | 'github_issue';

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  date: string;
  status: string;
  color: string;
  metadata: MilestoneItem | GoalItem | GitHubIssue;
}

/**
 * 이벤트 타입별 색상 설정
 */
export const EVENT_TYPE_COLORS = {
  milestone: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: "🎯",
    label: "마일스톤",
  },
  goal: {
    bg: "bg-amber-500",
    bgLight: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: "📋",
    label: "목표",
  },
  github_issue: {
    bg: "bg-red-500",
    bgLight: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: "🔴",
    label: "이슈",
  },
};

/**
 * KPI 메트릭 타입
 */
export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  changePercent?: number;
  color: string;
}

/**
 * 대시보드 데이터 타입
 */
export interface DashboardData {
  kpis: KPIMetric[];
  events: CalendarEvent[];
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

/**
 * 기간 필터 타입
 */
export type PeriodFilter = 'week' | 'month' | 'quarter';

/**
 * 운영 리포트 관련 타입
 */
export interface IncidentItem {
  id: string;
  date: string;
  description: string;
  status: "resolved" | "ongoing" | "investigating";
}

export interface InfraChangeItem {
  id: string;
  date: string;
  description: string;
  type: "upgrade" | "migration" | "maintenance" | "other";
}

export interface OperationsMetrics {
  uptime: string;
  responseTime: string;
  errorRate: string;
  activeUsers: string;
}

export interface OperationsData {
  serviceStatus: "operational" | "degraded" | "down";
  incidents: IncidentItem[];
  infraChanges: InfraChangeItem[];
  metrics: OperationsMetrics;
  notes: string;
}

/**
 * PO 리포트 관련 타입
 */
export interface TaskItem {
  id: string;
  text: string;
}

export interface POData {
  spending: string;
  completedTasks: TaskItem[];
  inProgressTasks: TaskItem[];
  blockers: TaskItem[];
  nextWeekPlan: TaskItem[];
}

/**
 * 통합 대시보드 상태
 */
export type DashboardTab = 'overview' | 'milestones' | 'goals' | 'revenue' | 'operations' | 'po';

/**
 * 운영 상태 색상/레이블
 */
export const SERVICE_STATUS = {
  operational: { label: "정상", color: "text-emerald-400", bg: "bg-emerald-500" },
  degraded: { label: "저하", color: "text-amber-400", bg: "bg-amber-500" },
  down: { label: "장애", color: "text-red-400", bg: "bg-red-500" },
};

export const INCIDENT_STATUS = {
  resolved: { label: "해결됨", color: "text-emerald-400" },
  ongoing: { label: "진행중", color: "text-amber-400" },
  investigating: { label: "조사중", color: "text-red-400" },
};

export const INFRA_CHANGE_TYPE = {
  upgrade: { label: "업그레이드", color: "text-blue-400" },
  migration: { label: "마이그레이션", color: "text-purple-400" },
  maintenance: { label: "유지보수", color: "text-amber-400" },
  other: { label: "기타", color: "text-gray-400" },
};
