/**
 * 게시글 필터/정렬 컴포넌트
 * - 최신순, 인기순, 댓글순, 조회순 정렬
 */

'use client';

import { Button } from '@atoms/Button';

type SortOption = 'latest' | 'popular' | 'comments' | 'views';

interface PostsFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function PostsFilter({
  currentSort,
  onSortChange,
}: PostsFilterProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'comments', label: '댓글순' },
    { value: 'views', label: '조회순' },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentSort === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
