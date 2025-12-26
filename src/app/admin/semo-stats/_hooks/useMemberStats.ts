"use client";

import { useQuery } from "@tanstack/react-query";

import { semoStatsClient } from "../_api-clients";

import type { DateRangeParams } from "../_api-clients";

export const MEMBER_STATS_QUERY_KEY = "member-stats";

export function useMemberStats(params: DateRangeParams) {
  return useQuery({
    queryKey: [MEMBER_STATS_QUERY_KEY, params],
    queryFn: () => semoStatsClient.getMemberStats(params),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
