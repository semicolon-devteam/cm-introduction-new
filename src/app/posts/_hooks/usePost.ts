/**
 * 게시글 상세 조회 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Error handling with user feedback
 * - View count increment (handled by API Route)
 */

'use client';

import { useState, useEffect } from 'react';

import { postsClient } from '../_api-clients';

import type { PostDetail } from '@/models/posts.types';

interface UsePostReturn {
  /** 게시글 상세 정보 */
  post: PostDetail | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
}

/**
 * 게시글 상세 조회 Hook
 * - 자동으로 조회수 증가
 *
 * @example
 * ```tsx
 * function PostDetailPage({ postId }: { postId: number }) {
 *   const { post, isLoading, error } = usePost(postId);
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   if (!post) return <NotFound />;
 *
 *   return <PostDetail post={post} />;
 * }
 * ```
 */
export function usePost(id: number): UsePostReturn {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Factory로 생성된 싱글톤 API Client 사용
      // 조회수 증가는 API Route에서 자동 처리됨
      const data = await postsClient.getPostById(id);
      setPost(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setError(errorMessage);
      setPost(null);

      console.error('[usePost] Failed to fetch post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    post,
    isLoading,
    error,
    refetch: fetchData,
  };
}
