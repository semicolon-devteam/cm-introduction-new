"use client";

import { KPIProgressCard, KPIProgressCardSkeleton } from "./KPIProgressCard";
import type { KPIMetric } from "./types";

interface KPISummaryCardsProps {
  metrics: KPIMetric[];
  isLoading?: boolean;
}

export function KPISummaryCards({ metrics, isLoading }: KPISummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <KPIProgressCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <KPIProgressCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
