"use client";

import { TrendingUp, Target, Activity, AlertCircle } from "lucide-react";

import {
  GoogleAnalyticsCard,
  SearchConsoleCard,
  SEOTrendChart,
  WeeklyMissionCard,
  KeywordRankingTracker,
  type SEOTrendData,
} from "@app/dashboard/_components";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface SearchConsoleData {
  connected: boolean;
  overview?: {
    current: { clicks: number; impressions: number; ctr: number; position: number };
    previous: { clicks: number; impressions: number; ctr: number; position: number };
    change: { clicks: number; impressions: number; ctr: number; position: number };
  };
}

interface AnalyticsData {
  connected: boolean;
  metrics?: {
    activeUsers: { value: number; changePercent?: number };
    sessions: { value: number; changePercent?: number };
    bounceRate: { value: number; changePercent?: number };
  };
}

interface OverviewTabProps {
  site: SEOSite;
  searchConsoleData: SearchConsoleData | null;
  analyticsData: AnalyticsData | null;
  trendData: SEOTrendData[];
  keywords: string[];
}

export function OverviewTab({
  site,
  searchConsoleData,
  analyticsData,
  trendData,
  keywords,
}: OverviewTabProps) {
  const stats = {
    totalClicks: searchConsoleData?.overview?.current.clicks || 0,
    clicksChange: searchConsoleData?.overview?.change.clicks || 0,
    avgPosition: searchConsoleData?.overview?.current.position || 0,
    positionChange: searchConsoleData?.overview?.change.position || 0,
    totalSessions: analyticsData?.metrics?.sessions.value || 0,
    sessionsChange: analyticsData?.metrics?.sessions.changePercent || 0,
    bounceRate: analyticsData?.metrics?.bounceRate.value || 0,
    bounceChange: analyticsData?.metrics?.bounceRate.changePercent || 0,
  };

  return (
    <div className="space-y-6">
      {/* 빠른 현황 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="총 클릭수"
          value={stats.totalClicks.toLocaleString()}
          subtext={`${stats.clicksChange > 0 ? "+" : ""}${stats.clicksChange}% 변화`}
          trend={stats.clicksChange > 0 ? "up" : stats.clicksChange < 0 ? "down" : "neutral"}
        />
        <QuickStatCard
          icon={<Target className="w-5 h-5 text-amber-400" />}
          label="평균 순위"
          value={stats.avgPosition.toFixed(1)}
          subtext={`${stats.positionChange > 0 ? "▼" : stats.positionChange < 0 ? "▲" : ""} ${Math.abs(stats.positionChange).toFixed(1)} 변화`}
          trend={stats.positionChange < 0 ? "up" : stats.positionChange > 0 ? "down" : "neutral"}
        />
        <QuickStatCard
          icon={<Activity className="w-5 h-5 text-blue-400" />}
          label="총 세션"
          value={stats.totalSessions.toLocaleString()}
          subtext={`${stats.sessionsChange > 0 ? "+" : ""}${stats.sessionsChange}% 변화`}
          trend={stats.sessionsChange > 0 ? "up" : stats.sessionsChange < 0 ? "down" : "neutral"}
        />
        <QuickStatCard
          icon={<AlertCircle className="w-5 h-5 text-red-400" />}
          label="이탈률"
          value={`${stats.bounceRate}%`}
          subtext={`${stats.bounceChange > 0 ? "+" : ""}${stats.bounceChange}% 변화`}
          trend={stats.bounceChange < 0 ? "up" : stats.bounceChange > 0 ? "down" : "neutral"}
        />
      </div>

      {/* AI 주간 미션 */}
      <WeeklyMissionCard
        projectId={site.id}
        domain={site.domain}
        keywords={keywords}
        searchConsoleData={
          searchConsoleData?.overview?.current
            ? {
                clicks: searchConsoleData.overview.current.clicks,
                impressions: searchConsoleData.overview.current.impressions,
                ctr: searchConsoleData.overview.current.ctr / 100,
                position: searchConsoleData.overview.current.position,
              }
            : undefined
        }
      />

      {/* 키워드 순위 추적 */}
      <KeywordRankingTracker projectId={site.id} keywords={keywords} />

      {/* Analytics + Search Console */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GoogleAnalyticsCard />
        <SearchConsoleCard />
      </div>

      {/* 트렌드 차트 */}
      {trendData.length > 0 && <SEOTrendChart data={trendData} title="SEO 성과 트렌드" />}
    </div>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
  subtext,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "neutral";
}) {
  const trendBg = {
    up: "bg-emerald-500/10",
    down: "bg-red-500/10",
    neutral: "bg-[#25262b]",
  };

  const trendText = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-[#909296]",
  };

  return (
    <div className={`rounded-lg p-4 ${trendBg[trend]}`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-[#909296]">{label}</div>
      <div className={`text-xs mt-1 ${trendText[trend]}`}>{subtext}</div>
    </div>
  );
}
