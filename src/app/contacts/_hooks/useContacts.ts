/**
 * useContacts Hook
 *
 * 문의 목록 조회를 위한 React Query hook
 */

import { useQuery } from "@tanstack/react-query";

import { contactsClient } from "@/app/contacts/_api-clients";
import type { GetContactsParams } from "@/app/contacts/_repositories";

export const CONTACTS_QUERY_KEY = "contacts";

export function useContacts(params: GetContactsParams = {}) {
  return useQuery({
    queryKey: [CONTACTS_QUERY_KEY, params],
    queryFn: () => contactsClient.getContacts(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
