/**
 * useCreateContact Hook Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { contactsClient } from "@/app/contacts/_api-clients";

import { useCreateContact } from "../useCreateContact";

// Mock API client
vi.mock("@/app/contacts/_api-clients", () => ({
  contactsClient: {
    createContact: vi.fn(),
    getContacts: vi.fn(),
  },
}));

const mockCreateContact = vi.mocked(contactsClient.createContact);

describe("useCreateContact", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it("문의를 생성한다", async () => {
    // Arrange
    const mockData = {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-2222",
      company: "회사명",
      message: "문의 내용입니다.",
      status: "NEW" as const,
      adminNotes: null,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: null,
      resolvedAt: null,
    };
    mockCreateContact.mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useCreateContact(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1111-2222",
        company: "회사명",
        message: "문의 내용입니다.",
      });
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockCreateContact).toHaveBeenCalledWith({
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-2222",
      company: "회사명",
      message: "문의 내용입니다.",
    });
  });

  it("에러 발생 시 isError가 true이다", async () => {
    // Arrange
    mockCreateContact.mockRejectedValue(new Error("Create failed"));

    // Act
    const { result } = renderHook(() => useCreateContact(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          name: "홍길동",
          email: "hong@example.com",
          message: "문의",
        });
      } catch {
        // Expected error
      }
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
