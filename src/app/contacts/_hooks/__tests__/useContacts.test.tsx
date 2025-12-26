/**
 * useContacts Hook Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { contactsClient } from "@/app/contacts/_api-clients";

import { useContacts, CONTACTS_QUERY_KEY } from "../useContacts";

// Mock API client
vi.mock("@/app/contacts/_api-clients", () => ({
  contactsClient: {
    getContacts: vi.fn(),
  },
}));

const mockGetContacts = vi.mocked(contactsClient.getContacts);

describe("useContacts", () => {
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
      },
    });
    vi.clearAllMocks();
  });

  it("문의 목록을 조회한다", async () => {
    // Arrange
    const mockData = {
      contacts: [
        {
          id: 1,
          name: "김철수",
          email: "chulsoo@example.com",
          phone: "010-1234-5678",
          company: "테스트 회사",
          message: "문의드립니다.",
          status: "NEW" as const,
          adminNotes: null,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: null,
          resolvedAt: null,
        },
      ],
      total: 1,
    };
    mockGetContacts.mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useContacts(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.contacts).toHaveLength(1);
    expect(result.current.data?.contacts[0].name).toBe("김철수");
    expect(result.current.data?.total).toBe(1);
  });

  it("에러 발생 시 isError가 true이다", async () => {
    // Arrange
    mockGetContacts.mockRejectedValue(new Error("API Error"));

    // Act
    const { result } = renderHook(() => useContacts(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it("로딩 중일 때 isLoading이 true이다", () => {
    // Arrange
    mockGetContacts.mockReturnValue(new Promise(() => {})); // Never resolves

    // Act
    const { result } = renderHook(() => useContacts(), { wrapper });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("상태 필터와 함께 올바른 query key를 사용한다", async () => {
    // Arrange
    mockGetContacts.mockResolvedValue({ contacts: [], total: 0 });

    // Act
    const { result } = renderHook(
      () => useContacts({ status: "NEW" }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    const queryState = queryClient.getQueryState([
      CONTACTS_QUERY_KEY,
      { status: "NEW" },
    ]);
    expect(queryState).toBeDefined();
  });
});
