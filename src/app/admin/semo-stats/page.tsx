"use client";

import { useState } from "react";

import {
  StatsOverviewCard,
  SkillUsageChart,
  UsageTrendChart,
  MemberStatsTable,
  DateRangeFilter,
} from "./_components";
import { useSemoStats } from "./_hooks";

import type { DateRange } from "./_api-clients";

export default function SemoStatsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const { data, isLoading, error } = useSemoStats({ range: dateRange });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            데이터를 불러오는데 실패했습니다
          </h2>
          <p className="mt-2 text-red-600">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEMO 사용 통계</h1>
          <p className="text-muted-foreground">
            팀 SEMO 사용 현황을 한눈에 확인하세요
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Overview Cards */}
      <StatsOverviewCard data={data?.overview} isLoading={isLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillUsageChart data={data?.skillUsage} isLoading={isLoading} />
        <UsageTrendChart data={data?.usageTrend} isLoading={isLoading} />
      </div>

      {/* Member Stats Table */}
      <MemberStatsTable data={data?.memberStats} isLoading={isLoading} />
    </div>
  );
}
