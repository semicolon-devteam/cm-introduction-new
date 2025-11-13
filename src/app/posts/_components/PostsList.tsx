/**
 * 게시글 목록 컴포넌트
 * - PostCard 렌더링
 * - 더 보기 버튼
 */

import { Button } from '@atoms/Button';
import { PostCard } from '@/components/molecules/PostCard';

import type { Post } from '@models/posts.types';

interface PostsListProps {
  posts: Post[];
  hasNext: boolean;
  onLoadMore: () => void;
}

export function PostsList({ posts, hasNext, onLoadMore }: PostsListProps) {
  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={String(post.id)}
            title={post.title}
            excerpt={post.content?.substring(0, 200) ?? ''}
            author={{
              name: post.writer_name ?? '익명',
              avatar: 'https://via.placeholder.com/40',
            }}
            category={post.board_name ?? '일반'}
            tags={[]}
            stats={{
              views: post.view_count,
              likes: post.like_count,
              comments: post.comment_count,
            }}
            createdAt={new Date(post.created_at).toLocaleDateString('ko-KR')}
          />
        ))}
      </div>

      {hasNext && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onLoadMore}
          >
            더 많은 게시물 보기
          </Button>
        </div>
      )}
    </>
  );
}
