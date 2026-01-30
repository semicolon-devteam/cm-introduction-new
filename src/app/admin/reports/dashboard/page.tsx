"use client";

import { useState, useCallback } from "react";
import {
  DashboardHeader,
  DashboardTabs,
  KPISummaryCards,
  CalendarView,
  CalendarViewSkeleton,
  GoalProgressChart,
  RevenueChart,
  GitHubIssuesList,
  MilestoneManager,
  GoalManager,
  RevenueManager,
  OperationsManager,
  POManager,
  ReportGenerator,
  type CalendarEvent,
  type PeriodFilter,
  type DashboardTab,
} from "./_components";
import { useDashboardData } from "./_hooks/useDashboardData";

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>("month");
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // 실제 데이터 훅 사용 (기간 필터 전달)
  const {
    isLoading,
    error,
    data,
    filteredData,
    calendarEvents,
    kpiMetrics,
    goalProgress,
    revenueData,
    dateRange,
    totalIssueCount,
    filteredIssueCount,
    saveMilestones,
    saveGoals,
    saveRevenue,
    saveOperations,
    savePOData,
    refreshIssues,
  } = useDashboardData(period);

  // 날짜 클릭 핸들러
  const handleDateClick = useCallback((date: Date) => {
    console.log("Date clicked:", date);
  }, []);

  // 이벤트 클릭 핸들러
  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (event.type === "github_issue" && event.metadata && "html_url" in event.metadata && event.metadata.html_url) {
      window.open(event.metadata.html_url as string, "_blank");
    }
  }, []);

  // 기간 라벨 생성
  const getPeriodLabel = () => {
    if (!dateRange) return "";
    const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
    switch (period) {
      case "week": return `이번 주 (${formatDate(dateRange.start)} - ${formatDate(dateRange.end)})`;
      case "month": return `이번 달 (${dateRange.start.getMonth() + 1}월)`;
      case "quarter": return `이번 분기 (Q${Math.floor(dateRange.start.getMonth() / 3) + 1})`;
      default: return "";
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

  // 개요 탭 렌더링
  const renderOverviewTab = () => (
    <>
      {/* GitHub 프로젝트 연결 상태 */}
      {!isLoading && (
        <div className="mb-4">
          {data.githubConnected ? (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>GitHub 프로젝트 연결됨: {data.githubProjectTitle} ({data.githubItemCount}개 아이템)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span>GitHub 프로젝트 연결 안됨 - .env.local에 GITHUB_TOKEN, GITHUB_ORG, GITHUB_PROJECT_NUMBER 설정 필요</span>
            </div>
          )}
        </div>
      )}

      {/* 데이터 없음 안내 */}
      {!isLoading && calendarEvents.length === 0 && kpiMetrics.every((m) => m.value === 0) && (
        <div className="mb-6 bg-[#1a1b23] border border-[#373A40] rounded-lg p-6 text-center">
          <p className="text-[#909296] mb-2">아직 등록된 데이터가 없습니다.</p>
          <p className="text-sm text-[#5c5f66]">
            위의 탭에서 마일스톤, 목표, 수익 등의 데이터를 입력하세요.
          </p>
        </div>
      )}

      {/* KPI 카드 */}
      <section className="mb-6">
        <KPISummaryCards metrics={kpiMetrics} isLoading={isLoading} />
      </section>

      {/* 달력 & 차트 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          {isLoading ? (
            <CalendarViewSkeleton />
          ) : (
            <CalendarView
              events={calendarEvents}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          )}
        </div>
        <div className="space-y-6">
          <GoalProgressChart
            data={goalProgress.length > 0 ? goalProgress : []}
            isLoading={isLoading}
          />
          <RevenueChart data={revenueData} projectRevenues={data.revenue.projectRevenues} isLoading={isLoading} />
        </div>
      </section>

      {/* GitHub 이슈 & 리포트 생성 */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GitHubIssuesList
          issues={filteredData.githubIssues}
          isLoading={isLoading}
          onRefresh={refreshIssues}
          projectTitle={data.githubProjectTitle}
          periodLabel={getPeriodLabel()}
          totalCount={totalIssueCount}
        />
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
      </section>
    </>
  );

  // 탭별 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "milestones":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MilestoneManager milestones={data.milestones} onSave={saveMilestones} />
            <div className="space-y-6">
              {isLoading ? (
                <CalendarViewSkeleton />
              ) : (
                <CalendarView
                  events={calendarEvents.filter((e) => e.type === "milestone")}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalManager goals={data.goals} onSave={saveGoals} />
            <div className="space-y-6">
              <GoalProgressChart
                data={goalProgress.length > 0 ? goalProgress : []}
                isLoading={isLoading}
              />
              {isLoading ? (
                <CalendarViewSkeleton />
              ) : (
                <CalendarView
                  events={calendarEvents.filter((e) => e.type === "goal")}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        );
      case "revenue":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <RevenueManager revenue={data.revenue} onSave={saveRevenue} />
              <MilestoneManager milestones={data.milestones} onSave={saveMilestones} />
            </div>
            <div className="space-y-6">
              <RevenueChart data={revenueData} projectRevenues={data.revenue.projectRevenues} isLoading={isLoading} />
              {isLoading ? (
                <CalendarViewSkeleton />
              ) : (
                <CalendarView
                  events={calendarEvents.filter((e) => e.type === "milestone")}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>
        );
      case "operations":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OperationsManager operations={data.operations} onSave={saveOperations} />
            <div className="space-y-6">
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
            </div>
          </div>
        );
      case "po":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <POManager poData={data.poData} onSave={savePOData} />
            <div className="space-y-6">
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
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <DashboardHeader period={period} onPeriodChange={setPeriod} />

        {/* 탭 네비게이션 */}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭 컨텐츠 */}
        {renderTabContent()}
      </main>
    </div>
  );
}
