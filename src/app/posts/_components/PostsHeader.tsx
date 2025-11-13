/**
 * 게시글 목록 헤더 컴포넌트
 * - 페이지 제목 및 설명
 * - 새 글 작성 버튼 (로그인 상태에 따라 다른 동작)
 */

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@atoms/Button';

interface PostsHeaderProps {
  isAuthenticated: boolean;
}

export function PostsHeader({ isAuthenticated }: PostsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">커뮤니티 피드</h1>
        <p className="text-muted-foreground">
          최신 게시물과 인기 토론을 확인하세요
        </p>
      </div>
      {isAuthenticated ? (
        <Link href="/posts/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>새 글 작성</span>
          </Button>
        </Link>
      ) : (
        <Link href="/auth/login">
          <Button className="gap-2">
            <span>로그인하여 글 작성</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
