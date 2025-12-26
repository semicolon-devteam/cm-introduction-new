/**
 * ContactsRepository Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { ContactsRepository } from "../contacts.repository";

const mockCreateServerSupabaseClient = vi.mocked(createServerSupabaseClient);

const createMockContact = (overrides = {}) => ({
  id: 1,
  name: "김철수",
  email: "chulsoo@example.com",
  phone: null,
  company: null,
  message: "문의드립니다.",
  status: "NEW",
  admin_notes: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: null,
  resolved_at: null,
  ...overrides,
});

describe("ContactsRepository", () => {
  let repository: ContactsRepository;
  let mockSupabase: { from: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    repository = new ContactsRepository();
    vi.clearAllMocks();
    mockSupabase = { from: vi.fn() };
    mockCreateServerSupabaseClient.mockResolvedValue(mockSupabase as never);
  });

  describe("getContacts", () => {
    it("문의 목록을 조회한다", async () => {
      const mockData = [createMockContact(), createMockContact({ id: 2, name: "이영희" })];
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 2 }),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.getContacts();

      expect(result.contacts).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.contacts[0]).toMatchObject({ id: 1, name: "김철수" });
    });

    it("상태 필터링이 동작한다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [createMockContact()], error: null, count: 1 }),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await repository.getContacts({ status: "NEW" });

      expect(mockQuery.eq).toHaveBeenCalledWith("status", "NEW");
    });

    it("에러 발생 시 예외를 던진다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error" }, count: null }),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(repository.getContacts()).rejects.toThrow("Failed to fetch contacts: Database error");
    });

    it("빈 목록일 때 빈 배열을 반환한다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        range: vi.fn().mockReturnThis(),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.getContacts();

      expect(result.contacts).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe("getContactById", () => {
    it("ID로 문의를 조회한다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createMockContact(), error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.getContactById(1);

      expect(result).toMatchObject({ id: 1, name: "김철수" });
      expect(mockQuery.eq).toHaveBeenCalledWith("id", 1);
    });

    it("존재하지 않는 ID일 때 null을 반환한다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116", message: "Not found" } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.getContactById(999);

      expect(result).toBeNull();
    });

    it("다른 에러 발생 시 예외를 던진다", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST500", message: "Server error" } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(repository.getContactById(1)).rejects.toThrow("Failed to fetch contact: Server error");
    });
  });

  describe("createContact", () => {
    it("문의를 생성한다", async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createMockContact({ name: "홍길동" }), error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.createContact({
        name: "홍길동",
        email: "hong@example.com",
        message: "문의 내용입니다.",
      });

      expect(result).toMatchObject({ name: "홍길동", status: "NEW" });
      expect(mockQuery.insert).toHaveBeenCalled();
    });

    it("에러 발생 시 예외를 던진다", async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Insert failed" } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(
        repository.createContact({ name: "홍길동", email: "hong@example.com", message: "문의" })
      ).rejects.toThrow("Failed to create contact: Insert failed");
    });
  });

  describe("updateContactStatus", () => {
    it("문의 상태를 업데이트한다", async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: createMockContact({ status: "ACK", admin_notes: "확인함" }), error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.updateContactStatus({ id: 1, status: "ACK", adminNotes: "확인함" });

      expect(result.status).toBe("ACK");
      expect(result.adminNotes).toBe("확인함");
    });

    it("RESOLVED 상태 시 resolved_at이 설정된다", async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: createMockContact({ status: "RESOLVED", resolved_at: "2024-01-02T00:00:00Z" }),
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await repository.updateContactStatus({ id: 1, status: "RESOLVED" });

      expect(result.status).toBe("RESOLVED");
      expect(result.resolvedAt).toBeDefined();
    });

    it("에러 발생 시 예외를 던진다", async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Update failed" } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      await expect(repository.updateContactStatus({ id: 1, status: "ACK" })).rejects.toThrow(
        "Failed to update contact status: Update failed"
      );
    });
  });
});
