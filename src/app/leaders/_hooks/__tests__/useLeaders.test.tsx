/**
 * useLeaders Hook 단위 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { useLeaders } from "../useLeaders";

import { leadersClient } from "@/app/leaders/_api-clients";

// Mock leadersClient
vi.mock("@/app/leaders/_api-clients", () => ({
  leadersClient: {
    getLeaders: vi.fn(),
  },
}));

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useLeaders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("리더 목록을 조회한다", async () => {
    const mockData = {
      leaders: [
        { id: 1, name: "테스트 리더", slug: "test" },
      ],
      total: 1,
    };

    vi.mocked(leadersClient.getLeaders).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLeaders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.leaders).toHaveLength(1);
    expect(result.current.data?.leaders[0].name).toBe("테스트 리더");
  });

  it("에러 발생 시 isError가 true이다", async () => {
    vi.mocked(leadersClient.getLeaders).mockRejectedValueOnce(new Error("Failed"));

    const { result } = renderHook(() => useLeaders(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("로딩 중일 때 isLoading이 true이다", () => {
    vi.mocked(leadersClient.getLeaders).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useLeaders(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("파라미터와 함께 올바른 query key를 사용한다", async () => {
    const mockData = { leaders: [], total: 0 };
    vi.mocked(leadersClient.getLeaders).mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () => useLeaders({ includeInactive: true }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(leadersClient.getLeaders).toHaveBeenCalledWith({ includeInactive: true });
  });
});
