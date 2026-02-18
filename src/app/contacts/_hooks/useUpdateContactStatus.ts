/**
 * useUpdateContactStatus Hook
 *
 * 문의 상태 업데이트를 위한 React Query mutation hook (관리자용)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contactsClient } from "@/app/contacts/_api-clients";
import type { UpdateContactStatusParams } from "@/app/contacts/_repositories";

import { CONTACTS_QUERY_KEY } from "./useContacts";

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateContactStatusParams) =>
      contactsClient.updateContactStatus(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
