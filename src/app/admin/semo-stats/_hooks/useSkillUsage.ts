"use client";

import { useQuery } from "@tanstack/react-query";

import { semoStatsClient } from "../_api-clients";

import type { DateRangeParams } from "../_api-clients";

export const SKILL_USAGE_QUERY_KEY = "skill-usage";

export function useSkillUsage(params: DateRangeParams) {
  return useQuery({
    queryKey: [SKILL_USAGE_QUERY_KEY, params],
    queryFn: () => semoStatsClient.getSkillUsage(params),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
