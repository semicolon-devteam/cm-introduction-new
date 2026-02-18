"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIMetric } from "./types";

interface KPIProgressCardProps {
  metric: KPIMetric;
}

export function KPIProgressCard({ metric }: KPIProgressCardProps) {
  const TrendIcon =
    metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;

  const trendColor =
    metric.trend === "up"
      ? "text-emerald-400"
      : metric.trend === "down"
        ? "text-red-400"
        : "text-gray-500";

  const progress = metric.target ? Math.min((metric.value / metric.target) * 100, 100) : null;

  const progressColor =
    progress === null
      ? "bg-brand-primary"
      : progress >= 100
        ? "bg-emerald-500"
        : progress >= 70
          ? "bg-brand-primary"
          : progress >= 30
            ? "bg-amber-500"
            : "bg-red-500";

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 hover:border-brand-primary/30 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#909296]">{metric.label}</span>
        {metric.changePercent !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(metric.changePercent)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-3xl font-bold text-white">
          {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
        </span>
        {metric.unit && <span className="text-lg text-[#5c5f66] ml-1">{metric.unit}</span>}
      </div>

      {/* Progress Bar (if target exists) */}
      {progress !== null && (
        <div>
          <div className="flex justify-between text-xs text-[#5c5f66] mb-1">
            <span>
              목표: {metric.target?.toLocaleString()}
              {metric.unit}
            </span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-[#25262b] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function KPIProgressCardSkeleton() {
  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-16 bg-[#25262b] animate-pulse rounded" />
        <div className="h-4 w-12 bg-[#25262b] animate-pulse rounded" />
      </div>
      <div className="h-9 w-24 bg-[#25262b] animate-pulse rounded mb-3" />
      <div className="h-1.5 w-full bg-[#25262b] animate-pulse rounded" />
    </div>
  );
}

export { KPIProgressCardSkeleton };
