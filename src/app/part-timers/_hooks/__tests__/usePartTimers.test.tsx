/**
 * usePartTimers Hook Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { partTimersClient } from "@/app/part-timers/_api-clients";

import { usePartTimers, PART_TIMERS_QUERY_KEY } from "../usePartTimers";

// Mock API client
vi.mock("@/app/part-timers/_api-clients", () => ({
  partTimersClient: {
    getPartTimers: vi.fn(),
  },
}));

const mockGetPartTimers = vi.mocked(partTimersClient.getPartTimers);

describe("usePartTimers", () => {
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

  it("파트타이머 목록을 조회한다", async () => {
    // Arrange
    const mockData = {
      partTimers: [
        {
          id: 1,
          nickname: "Garden",
          role: "Backend Developer",
          team: "Core Team",
          isActive: true,
          displayOrder: 1,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: null,
        },
      ],
      total: 1,
    };
    mockGetPartTimers.mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => usePartTimers(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.partTimers).toHaveLength(1);
    expect(result.current.data?.partTimers[0].nickname).toBe("Garden");
    expect(result.current.data?.total).toBe(1);
  });

  it("에러 발생 시 isError가 true이다", async () => {
    // Arrange
    mockGetPartTimers.mockRejectedValue(new Error("API Error"));

    // Act
    const { result } = renderHook(() => usePartTimers(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it("로딩 중일 때 isLoading이 true이다", () => {
    // Arrange
    mockGetPartTimers.mockReturnValue(new Promise(() => {})); // Never resolves

    // Act
    const { result } = renderHook(() => usePartTimers(), { wrapper });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("올바른 query key를 사용한다", async () => {
    // Arrange
    mockGetPartTimers.mockResolvedValue({ partTimers: [], total: 0 });

    // Act
    const { result } = renderHook(
      () => usePartTimers({ includeInactive: true }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    const queryState = queryClient.getQueryState([
      PART_TIMERS_QUERY_KEY,
      { includeInactive: true },
    ]);
    expect(queryState).toBeDefined();
  });
});
