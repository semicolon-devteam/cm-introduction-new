/**
 * useSemoStats Hook Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

import { semoStatsClient } from "@/app/admin/semo-stats/_api-clients";

import { useSemoStats, SEMO_STATS_QUERY_KEY } from "../useSemoStats";

// Mock API client
vi.mock("@/app/admin/semo-stats/_api-clients", () => ({
  semoStatsClient: {
    getStats: vi.fn(),
  },
}));

const mockGetStats = vi.mocked(semoStatsClient.getStats);

describe("useSemoStats", () => {
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

  it("API에서 통계 데이터를 조회한다", async () => {
    // Arrange
    const mockData = {
      overview: {
        totalInteractions: 100,
        activeUsers: 5,
        dailyAverage: 14.3,
        totalMemories: 50,
        interactionsChange: 10,
        usersChange: 5,
        dailyAverageChange: 8,
        memoriesChange: 15,
      },
      skillUsage: [{ skillName: "coder", count: 20, percentage: 40 }],
      usageTrend: [{ date: "2024-01-01", interactions: 15, memories: 3 }],
      memberStats: [],
      memoryTypes: [],
      dateRange: { range: "30d" as const },
      generatedAt: new Date().toISOString(),
    };
    mockGetStats.mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useSemoStats({ range: "30d" }), {
      wrapper,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockGetStats).toHaveBeenCalledWith({ range: "30d" });
  });

  it("API 에러 시 error 상태를 반환한다", async () => {
    // Arrange
    mockGetStats.mockRejectedValue(new Error("API Error"));

    // Act
    const { result } = renderHook(() => useSemoStats({ range: "7d" }), {
      wrapper,
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("로딩 중일 때 isLoading이 true이다", () => {
    // Arrange
    mockGetStats.mockReturnValue(new Promise(() => {})); // Never resolves

    // Act
    const { result } = renderHook(() => useSemoStats({ range: "30d" }), {
      wrapper,
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
  });

  it("올바른 query key를 사용한다", async () => {
    // Arrange
    mockGetStats.mockResolvedValue({} as ReturnType<typeof semoStatsClient.getStats> extends Promise<infer T> ? T : never);

    // Act
    const { result } = renderHook(() => useSemoStats({ range: "90d" }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - query key 확인
    const queryState = queryClient.getQueryState([
      SEMO_STATS_QUERY_KEY,
      { range: "90d" },
    ]);
    expect(queryState).toBeDefined();
  });
});
