/**
 * 게시글 목록 페이지
 * Development Philosophy:
 * - Domain-driven structure with _components
 * - Client Component for dynamic data
 * - Clean separation of concerns
 */

'use client';

import { useState } from 'react';

import { CommunityLayout } from '@templates/CommunityLayout';
import { useAuth } from '@hooks/auth';

import {
  PostsHeader,
  PostsFilter,
  PostsList,
  PostsEmptyState,
  PostsLoadingState,
  PostsErrorState,
} from './_components';
import { usePosts } from './_hooks';

export default function PostsPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comments' | 'views'>('latest');
  const { posts, isLoading, error, hasNext, loadMore } = usePosts({
    sortBy,
    limit: 20,
  });

  if (isLoading) {
    return (
      <CommunityLayout>
        <PostsLoadingState />
      </CommunityLayout>
    );
  }

  if (error) {
    return (
      <CommunityLayout>
        <PostsErrorState
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <PostsHeader isAuthenticated={!!user} />
      <PostsFilter currentSort={sortBy} onSortChange={setSortBy} />
      {posts.length === 0 ? (
        <PostsEmptyState isAuthenticated={!!user} />
      ) : (
        <PostsList
          posts={posts}
          hasNext={hasNext}
          onLoadMore={() => void loadMore()}
        />
      )}
    </CommunityLayout>
  );
}
