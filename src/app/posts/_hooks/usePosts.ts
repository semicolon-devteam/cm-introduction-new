/**
 * 게시글 목록 조회 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Error handling with user feedback
 * - Loading states for better UX
 * - Pagination and infinite scroll support
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

import { postsClient } from '../_api-clients';

import type { GetPostsParams, GetPostsResponse } from '@/models/posts.types';

interface UsePostsReturn extends GetPostsResponse {
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
  /** 다음 페이지 로드 */
  loadMore: () => Promise<void>;
  /** 페이지 변경 */
  goToPage: (page: number) => void;
}

/**
 * 게시글 목록 조회 Hook
 *
 * @example
 * ```tsx
 * function PostList() {
 *   const { posts, isLoading, error, loadMore, hasNext } = usePosts({
 *     boardId: 1,
 *     sortBy: 'latest',
 *     limit: 20
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <>
 *       {posts.map(post => <PostCard key={post.id} post={post} />)}
 *       {hasNext && <Button onClick={loadMore}>더 보기</Button>}
 *     </>
 *   );
 * }
 * ```
 */
export function usePosts(params: GetPostsParams = {}): UsePostsReturn {
  const [posts, setPosts] = useState<GetPostsResponse['posts']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page ?? 1);
  const [limit] = useState(params.limit ?? 20);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stable params reference
  const { boardId, search, sortBy = 'latest', includeNotice = true } = params;

  const fetchData = useCallback(
    async (currentPage: number, append: boolean = false) => {
      try {
        setIsLoading(true);
        setError(null);

        // Factory로 생성된 싱글톤 API Client 사용
        const response = await postsClient.getPosts({
          boardId,
          search,
          sortBy,
          includeNotice,
          page: currentPage,
          limit,
        });

        if (append) {
          setPosts((prev) => [...prev, ...response.posts]);
        } else {
          setPosts(response.posts);
        }

        setTotal(response.total);
        setTotalPages(response.totalPages);
        setHasNext(response.hasNext);
        setHasPrev(response.hasPrev);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
        setError(errorMessage);

        setPosts([]);
        setTotal(0);

        console.error('[usePosts] Failed to fetch posts:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [boardId, search, sortBy, includeNotice, limit]
  );

  // params 변경 시 초기화 및 첫 페이지 로드
  useEffect(() => {
    setPage(1); // params 변경 시 첫 페이지로 리셋
    void fetchData(1, false);
  }, [boardId, search, sortBy, includeNotice, limit, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(page, false);
  }, [fetchData, page]);

  const loadMore = useCallback(async () => {
    if (!hasNext || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchData(nextPage, true);
  }, [hasNext, isLoading, fetchData, page]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setPage(newPage);
      void fetchData(newPage, false);
    },
    [totalPages, fetchData]
  );

  return {
    posts,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
    isLoading,
    error,
    refetch,
    loadMore,
    goToPage,
  };
}
