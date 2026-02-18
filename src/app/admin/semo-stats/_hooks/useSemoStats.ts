"use client";

import { useQuery } from "@tanstack/react-query";

import { semoStatsClient } from "../_api-clients";

import type { DateRangeParams } from "../_api-clients";

export const SEMO_STATS_QUERY_KEY = "semo-stats";

export function useSemoStats(params: DateRangeParams) {
  return useQuery({
    queryKey: [SEMO_STATS_QUERY_KEY, params],
    queryFn: () => semoStatsClient.getStats(params),
    staleTime: 60 * 1000, // 1분 캐싱
    refetchOnWindowFocus: false,
  });
}
