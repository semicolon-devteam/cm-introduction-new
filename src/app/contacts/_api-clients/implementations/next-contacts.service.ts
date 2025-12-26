/**
 * Next.js API Route를 통한 Contacts API Client 구현
 */

import type { ContactsApiClient } from "../interfaces";
import type {
  Contact,
  GetContactsParams,
  CreateContactParams,
  UpdateContactStatusParams,
} from "@/app/contacts/_repositories";

export class NextContactsService implements ContactsApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  }

  async getContacts(params: GetContactsParams = {}): Promise<{
    contacts: Contact[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();

    if (params.status) {
      searchParams.set("status", params.status);
    }

    if (params.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const queryString = searchParams.toString();
    const url = `${this.baseUrl}/contacts${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contacts: ${response.statusText}`);
    }

    return response.json();
  }

  async getContactById(id: number): Promise<Contact | null> {
    const response = await fetch(`${this.baseUrl}/contacts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch contact: ${response.statusText}`);
    }

    return response.json();
  }

  async createContact(params: CreateContactParams): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to create contact: ${response.statusText}`);
    }

    return response.json();
  }

  async updateContactStatus(
    params: UpdateContactStatusParams
  ): Promise<Contact> {
    const response = await fetch(`${this.baseUrl}/contacts/${params.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: params.status,
        adminNotes: params.adminNotes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update contact status: ${response.statusText}`);
    }

    return response.json();
  }
}
