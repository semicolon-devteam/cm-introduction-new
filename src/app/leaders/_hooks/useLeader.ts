/**
 * useLeader Hook
 *
 * 단일 리더 조회 (slug 기반)
 */

import { useQuery } from "@tanstack/react-query";

import { leadersClient } from "../_api-clients";

export const LEADER_QUERY_KEY = "leader";

export function useLeader(slug: string) {
  return useQuery({
    queryKey: [LEADER_QUERY_KEY, slug],
    queryFn: () => leadersClient.getLeaderBySlug(slug),
    enabled: !!slug,
  });
}
