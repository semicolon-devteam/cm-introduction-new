/**
 * usePosts Hook 단위 테스트
 * React 상태 관리 및 API 호출 테스트
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { usePosts } from "../usePosts";

import type { GetPostsParams, GetPostsResponse, Post } from "@/models/posts.types";

// Mock postsClient
vi.mock("@/app/posts/_api-clients", () => ({
  postsClient: {
    getPosts: vi.fn(),
  },
}));

// Import after mock
import { postsClient } from "@/app/posts/_api-clients";

// Helper to create mock post
const createMockPost = (id: number, title: string): Post => ({
  id,
  title,
  board_id: 1,
  board_name: "Test Board",
  content: "Content",
  category_id: null,
  parent_id: null,
  writer_id: 1,
  writer_name: "User 1",
  view_count: 0,
  comment_count: 0,
  like_count: 0,
  dislike_count: 0,
  download_point: 0,
  metadata: {},
  is_notice: false,
  is_secret: false,
  is_anonymous: false,
  status: "published",
  created_at: "2025-01-01T00:00:00Z",
  created_by: 1,
  updated_at: "2025-01-01T00:00:00Z",
  updated_by: null,
  deleted_at: null,
  thumbnail: null,
  attachments: null,
  restrict_attachments: null,
});

// Helper to create mock response
const createMockResponse = (override?: Partial<GetPostsResponse>): GetPostsResponse => ({
  posts: [createMockPost(1, "Test Post 1")],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  ...override,
});

describe("usePosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(postsClient.getPosts).mockResolvedValue(createMockResponse());
  });

  describe("초기 로딩", () => {
    it("초기 상태는 로딩 중이다", () => {
      const { result } = renderHook(() => usePosts());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it("데이터 로딩이 완료되면 게시글을 반환한다", async () => {
      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posts).toHaveLength(1);
      expect(result.current.posts[0]).toHaveProperty("id", 1);
      expect(result.current.posts[0]).toHaveProperty("title", "Test Post 1");
      expect(result.current.error).toBeNull();
    });

    it("에러 발생 시 에러를 반환한다", async () => {
      const errorMessage = "Failed to fetch posts";
      vi.mocked(postsClient.getPosts).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  describe("파라미터 처리", () => {
    it("게시판 ID로 필터링한다", async () => {
      const params: GetPostsParams = { boardId: 1 };
      const { result } = renderHook(() => usePosts(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(postsClient.getPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          boardId: 1,
        }),
      );
    });

    it("검색어로 필터링한다", async () => {
      const params: GetPostsParams = { search: "test" };
      const { result } = renderHook(() => usePosts(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(postsClient.getPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          search: "test",
        }),
      );
    });

    it("정렬 옵션을 적용한다", async () => {
      const params: GetPostsParams = { sortBy: "popular" };
      const { result } = renderHook(() => usePosts(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(postsClient.getPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: "popular",
        }),
      );
    });
  });

  describe("페이지네이션 기능", () => {
    it("다음 페이지를 로드한다 (loadMore)", async () => {
      vi.mocked(postsClient.getPosts)
        .mockResolvedValueOnce(
          createMockResponse({
            posts: [createMockPost(1, "Post 1")],
            page: 1,
            limit: 1,
            total: 2,
            totalPages: 2,
            hasNext: true,
            hasPrev: false,
          }),
        )
        .mockResolvedValueOnce(
          createMockResponse({
            posts: [createMockPost(2, "Post 2")],
            page: 2,
            limit: 1,
            total: 2,
            totalPages: 2,
            hasNext: false,
            hasPrev: true,
          }),
        );

      const { result } = renderHook(() => usePosts({ limit: 1 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.hasNext).toBe(true);

      await result.current.loadMore();

      await waitFor(() => {
        expect(result.current.posts).toHaveLength(2);
      });

      expect(result.current.page).toBe(2);
    });

    it("hasNext가 false일 때 loadMore를 호출하지 않는다", async () => {
      vi.mocked(postsClient.getPosts).mockResolvedValue(
        createMockResponse({
          hasNext: false,
        }),
      );

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(postsClient.getPosts).mock.calls.length;
      await result.current.loadMore();

      expect(vi.mocked(postsClient.getPosts).mock.calls.length).toBe(callCountBefore);
    });
  });

  describe("데이터 새로고침", () => {
    it("refetch로 현재 페이지를 다시 로드한다", async () => {
      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(postsClient.getPosts).mock.calls.length;

      await result.current.refetch();

      await waitFor(() => {
        expect(vi.mocked(postsClient.getPosts).mock.calls.length).toBe(callCountBefore + 1);
      });
    });
  });

  describe("상태 관리", () => {
    it("페이지네이션 메타데이터를 올바르게 저장한다", async () => {
      vi.mocked(postsClient.getPosts).mockResolvedValue(
        createMockResponse({
          posts: [],
          total: 100,
          page: 1,
          limit: 20,
          totalPages: 5,
          hasNext: true,
          hasPrev: false,
        }),
      );

      const { result } = renderHook(() => usePosts({ limit: 20 }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.total).toBe(100);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.hasNext).toBe(true);
      expect(result.current.hasPrev).toBe(false);
    });
  });
});
