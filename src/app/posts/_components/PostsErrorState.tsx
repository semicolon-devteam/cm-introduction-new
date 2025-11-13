/**
 * 게시글 에러 상태 컴포넌트
 */

import { Button } from '@atoms/Button';

interface PostsErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function PostsErrorState({ message, onRetry }: PostsErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-destructive mb-4">{message}</p>
        <Button onClick={onRetry}>다시 시도</Button>
      </div>
    </div>
  );
}
