/**
 * Contacts Repository
 *
 * Supabase를 통한 외부 문의 데이터 접근
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Database, InquiryStatus } from "@/lib/supabase/database.types";

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: InquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string | null;
  resolvedAt: string | null;
}

export interface GetContactsParams {
  status?: InquiryStatus;
  limit?: number;
}

export interface GetContactsResponse {
  contacts: Contact[];
  total: number;
}

export interface CreateContactParams {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
}

export interface UpdateContactStatusParams {
  id: number;
  status: InquiryStatus;
  adminNotes?: string;
}

function mapRowToContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    message: row.message,
    status: row.status ?? "NEW",
    adminNotes: row.admin_notes,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
  };
}

export class ContactsRepository {
  /**
   * 문의 목록 조회
   */
  async getContacts(
    params: GetContactsParams = {}
  ): Promise<GetContactsResponse> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (params.status) {
      query = query.eq("status", params.status);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    const contacts = ((data ?? []) as ContactRow[]).map(mapRowToContact);

    return {
      contacts,
      total: contacts.length,
    };
  }

  /**
   * 단일 문의 조회
   */
  async getContactById(id: number): Promise<Contact | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch contact: ${error.message}`);
    }

    return mapRowToContact(data as ContactRow);
  }

  /**
   * 문의 생성 (외부 폼 제출)
   */
  async createContact(params: CreateContactParams): Promise<Contact> {
    const supabase = await createServerSupabaseClient();

    const insertData: ContactInsert = {
      name: params.name,
      email: params.email,
      phone: params.phone ?? null,
      company: params.company ?? null,
      message: params.message,
      status: "NEW",
    };

    const { data, error } = await supabase
      .from("contacts")
      .insert(insertData as never)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }

    return mapRowToContact(data as ContactRow);
  }

  /**
   * 문의 상태 업데이트 (관리자용)
   */
  async updateContactStatus(
    params: UpdateContactStatusParams
  ): Promise<Contact> {
    const supabase = await createServerSupabaseClient();

    const updateData: ContactUpdate = {
      status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (params.adminNotes !== undefined) {
      updateData.admin_notes = params.adminNotes;
    }

    if (params.status === "RESOLVED" || params.status === "CLOSED") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("contacts")
      .update(updateData as never)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contact status: ${error.message}`);
    }

    return mapRowToContact(data as ContactRow);
  }
}
