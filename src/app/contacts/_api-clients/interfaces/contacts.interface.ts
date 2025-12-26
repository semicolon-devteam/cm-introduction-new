/**
 * Contacts API Client Interface
 */

import type {
  Contact,
  GetContactsParams,
  CreateContactParams,
  UpdateContactStatusParams,
} from "@/app/contacts/_repositories";

export interface ContactsApiClient {
  getContacts(params?: GetContactsParams): Promise<{
    contacts: Contact[];
    total: number;
  }>;

  getContactById(id: number): Promise<Contact | null>;

  createContact(params: CreateContactParams): Promise<Contact>;

  updateContactStatus(params: UpdateContactStatusParams): Promise<Contact>;
}
