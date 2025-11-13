/**
 * 게시글 빈 상태 컴포넌트
 * - 게시글이 없을 때 표시
 * - 로그인 상태에 따라 다른 메시지 표시
 */

import Link from 'next/link';

import { Button } from '@atoms/Button';

interface PostsEmptyStateProps {
  isAuthenticated: boolean;
}

export function PostsEmptyState({ isAuthenticated }: PostsEmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          아직 작성된 게시글이 없습니다.
        </p>
        {isAuthenticated && (
          <Link href="/posts/new">
            <Button>첫 게시글 작성하기</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
