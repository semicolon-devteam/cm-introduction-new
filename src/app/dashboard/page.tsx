"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  BarChart2,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  DollarSign,
  FileText,
} from "lucide-react";
import {
  DashboardHeader,
  KPISummaryCards,
  CalendarView,
  CalendarViewSkeleton,
  GoalProgressChart,
  RevenueChart,
  GitHubIssuesList,
  GoalManager,
  GoalComparisonView,
  RevenueManager,
  ReportGenerator,
  GoogleAnalyticsCard,
  SearchConsoleCard,
  type CalendarEvent,
  type PeriodFilter,
} from "./_components";
import { useDashboardData } from "./_hooks/useDashboardData";

// Collapsible 섹션 컴포넌트
interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  badgeColor?: string;
}

function CollapsibleSection({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = "bg-[#373A40]",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#1a1b23] border border-[#373A40] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#25262b] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#909296]">{icon}</div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{title}</span>
              {badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${badgeColor} text-white`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-[#5c5f66] mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="border-t border-[#373A40]">{children}</div>}
    </div>
  );
}

// KPI 미니 카드 컴포넌트 (목표/수익용)
interface MiniKPICardProps {
  label: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "neutral";
  color: string;
}

function MiniKPICard({ label, value, unit, trend, color }: MiniKPICardProps) {
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "━";
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-[#909296]";

  const colorClasses: Record<string, string> = {
    "brand-primary": "text-violet-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
  };

  return (
    <div className="bg-[#25262b] rounded-lg p-3 flex flex-col">
      <span className="text-xs text-[#909296]">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-xl font-bold ${colorClasses[color] || "text-white"}`}>
          {value.toLocaleString()}
        </span>
        <span className="text-sm text-[#909296]">{unit}</span>
      </div>
      <span className={`text-xs mt-1 ${trendColor}`}>{trendIcon}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>("month");
  const [showGoalComparison, setShowGoalComparison] = useState(false);

  // 데이터 훅 사용
  const {
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
    totalIssueCount,
    saveGoals,
    saveRevenue,
    refreshIssues,
  } = useDashboardData(period);

  // 날짜 클릭 핸들러
  const handleDateClick = useCallback((date: Date) => {
    console.log("Date clicked:", date);
  }, []);

  // 이벤트 클릭 핸들러
  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (
      event.type === "github_issue" &&
      event.metadata &&
      "html_url" in event.metadata &&
      event.metadata.html_url
    ) {
      window.open(event.metadata.html_url as string, "_blank");
    }
  }, []);

  // 기간 라벨 생성
  const getPeriodLabel = () => {
    if (!dateRange) return "";
    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    switch (period) {
      case "week":
        return `이번 주 (${formatDate(dateRange.start)} - ${formatDate(dateRange.end)})`;
      case "month":
        return `이번 달 (${dateRange.start.getMonth() + 1}월)`;
      case "quarter":
        return `이번 분기 (Q${Math.floor(dateRange.start.getMonth() / 3) + 1})`;
      default:
        return "";
    }
  };

  // 에러 표시
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 이슈 새로고침 핸들러 (void 반환)
  const handleRefreshIssues = () => {
    void refreshIssues();
  };

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        {/* GitHub 연결 상태 */}
        {!isLoading && (
          <div className="mb-6">
            {data.githubConnected ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>
                  GitHub 연결됨: {data.githubProjectTitle} ({data.githubItemCount}개 아이템)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                <span>
                  GitHub 프로젝트 연결 안됨 - .env.local에 GITHUB_TOKEN, GITHUB_ORG,
                  GITHUB_PROJECT_NUMBER 설정 필요
                </span>
              </div>
            )}
          </div>
        )}

        {/* 섹션 1: 버그 현황 (GitHub KPIs) */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">버그 현황</h2>
            <span className="text-sm text-[#909296]">({getPeriodLabel()})</span>
          </div>
          <KPISummaryCards metrics={kpiMetrics} isLoading={isLoading} />
        </section>

        {/* 섹션 1.5: SEO 분석 (Google Analytics + Search Console) */}
        <section className="mb-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GoogleAnalyticsCard />
          <SearchConsoleCard />
        </section>

        {/* 섹션 2: 목표 & 수익 요약 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">목표 & 수익 요약</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {extendedKPIs.map((kpi) => (
              <MiniKPICard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                trend={kpi.trend}
                color={kpi.color}
              />
            ))}
          </div>
        </section>

        {/* 섹션 3: 목표 관리 (Collapsible) */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div />
            {data.goals.length >= 2 && (
              <button
                onClick={() => setShowGoalComparison(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                목표 비교
              </button>
            )}
          </div>
          <CollapsibleSection
            title="목표 관리"
            subtitle="프로젝트별 목표 설정 및 진행 상황 관리"
            icon={<CheckCircle className="w-5 h-5" />}
            badge={data.goals.length}
            badgeColor={data.goals.length > 0 ? "bg-violet-500" : "bg-[#373A40]"}
            defaultOpen={data.goals.length === 0}
          >
            <GoalManager goals={data.goals} onSave={saveGoals} />
          </CollapsibleSection>
        </section>

        {/* 섹션 4: 수익 관리 (Collapsible) */}
        <section className="mb-6">
          <CollapsibleSection
            title="수익 관리"
            subtitle="프로젝트별 매출 목표 및 실적 관리"
            icon={<DollarSign className="w-5 h-5" />}
            badge={
              data.revenue.targetRevenue > 0
                ? `${Math.round((data.revenue.currentRevenue / data.revenue.targetRevenue) * 100)}%`
                : "미설정"
            }
            badgeColor={
              data.revenue.targetRevenue > 0
                ? data.revenue.currentRevenue >= data.revenue.targetRevenue
                  ? "bg-emerald-500"
                  : "bg-blue-500"
                : "bg-[#373A40]"
            }
            defaultOpen={data.revenue.targetRevenue === 0}
          >
            <RevenueManager revenue={data.revenue} onSave={saveRevenue} />
          </CollapsibleSection>
        </section>

        {/* 섹션 5: 차트 영역 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GoalProgressChart data={goalProgress.length > 0 ? goalProgress : []} isLoading={isLoading} />
          <RevenueChart
            data={revenueData}
            projectRevenues={data.revenue.projectRevenues}
            isLoading={isLoading}
          />
        </section>

        {/* 섹션 6: 달력 */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">일정 달력</h2>
            <span className="text-sm text-[#909296]">
              (마일스톤, 목표, 이슈: {calendarEvents.length}건)
            </span>
          </div>
          {isLoading ? (
            <CalendarViewSkeleton />
          ) : (
            <CalendarView
              events={calendarEvents}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
        </section>

        {/* 섹션 7: GitHub 이슈 & 리포트 */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <GitHubIssuesList
            issues={filteredData.githubIssues}
            isLoading={isLoading}
            onRefresh={handleRefreshIssues}
            projectTitle={data.githubProjectTitle}
            periodLabel={getPeriodLabel()}
            totalCount={totalIssueCount}
          />

          <CollapsibleSection
            title="리포트 생성"
            subtitle="주간/월간 리포트 자동 생성"
            icon={<FileText className="w-5 h-5" />}
            defaultOpen={false}
          >
            <ReportGenerator
              milestones={data.milestones}
              goals={data.goals}
              revenue={data.revenue}
              operations={data.operations}
              poData={data.poData}
              githubConnected={data.githubConnected}
              githubIssues={data.githubIssues}
              projectTitle={data.githubProjectTitle}
            />
          </CollapsibleSection>
        </section>

        {/* 목표 비교 모달 */}
        <GoalComparisonView
          goals={data.goals}
          isOpen={showGoalComparison}
          onClose={() => setShowGoalComparison(false)}
        />
      </main>
    </div>
  );
}
