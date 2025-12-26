/**
 * usePartTimers Hook
 *
 * 파트타이머 목록 조회를 위한 React Query 훅
 */

"use client";

import { useQuery } from "@tanstack/react-query";

import { partTimersClient } from "../_api-clients";

import type { GetPartTimersParams } from "../_repositories";

export const PART_TIMERS_QUERY_KEY = "part-timers";

export function usePartTimers(params: GetPartTimersParams = {}) {
  return useQuery({
    queryKey: [PART_TIMERS_QUERY_KEY, params],
    queryFn: () => partTimersClient.getPartTimers(params),
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    refetchOnWindowFocus: false,
  });
}
