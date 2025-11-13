/**
 * 게시글 로딩 상태 컴포넌트
 */

export function PostsLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">게시글을 불러오는 중...</p>
      </div>
    </div>
  );
}
