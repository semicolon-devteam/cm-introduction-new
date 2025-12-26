"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";

import type { SemoStatsOverview } from "../_api-clients";

interface StatsOverviewCardProps {
  data: SemoStatsOverview | undefined;
  isLoading: boolean;
}

interface StatItemProps {
  title: string;
  value: number | string;
  change: number;
  suffix?: string;
}

function StatItem({ title, value, change, suffix = "" }: StatItemProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const TrendIcon =
    change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor =
    change > 0
      ? "text-green-600"
      : change < 0
        ? "text-red-600"
        : "text-gray-500";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value)}
          {suffix && <span className="text-lg font-normal">{suffix}</span>}
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatItemSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

export function StatsOverviewCard({
  data,
  isLoading,
}: StatsOverviewCardProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatItem
        title="전체 사용"
        value={data.totalInteractions}
        change={data.interactionsChange}
      />
      <StatItem
        title="활성 유저"
        value={data.activeUsers}
        change={data.usersChange}
        suffix="명"
      />
      <StatItem
        title="일평균"
        value={data.dailyAverage}
        change={data.dailyAverageChange}
        suffix="회"
      />
      <StatItem
        title="메모리"
        value={data.totalMemories}
        change={data.memoriesChange}
        suffix="건"
      />
    </div>
  );
}
