/**
 * useLeaders Hook
 *
 * 리더 목록 조회
 */

import { useQuery } from "@tanstack/react-query";

import { leadersClient } from "../_api-clients";

import type { GetLeadersParams } from "../_repositories";

export const LEADERS_QUERY_KEY = "leaders";

export function useLeaders(params: GetLeadersParams = {}) {
  return useQuery({
    queryKey: [LEADERS_QUERY_KEY, params],
    queryFn: () => leadersClient.getLeaders(params),
  });
}
