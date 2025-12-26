/**
 * useCreateContact Hook
 *
 * 문의 생성을 위한 React Query mutation hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contactsClient } from "@/app/contacts/_api-clients";
import type { CreateContactParams } from "@/app/contacts/_repositories";

import { CONTACTS_QUERY_KEY } from "./useContacts";

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateContactParams) =>
      contactsClient.createContact(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [CONTACTS_QUERY_KEY] });
    },
  });
}
