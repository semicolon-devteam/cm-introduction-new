/**
 * 게시글 상세 페이지
 * Development Philosophy:
 * - Client Component for dynamic data
 * - usePost hook for data fetching
 * - Clean separation of concerns
 */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@atoms/Button";
import { CommunityLayout } from "@templates/CommunityLayout";
import { useAuth } from "@hooks/auth";

import { PostDetail } from "../_components/PostDetail";
import { PostsErrorState } from "../_components/PostsErrorState";
import { PostsLoadingState } from "../_components/PostsLoadingState";
import { usePost } from "../_hooks";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const postId = Number(id);

  const { post, isLoading, error } = usePost(postId);

  // 게시글 작성자인지 확인
  const canEdit = user && post && post.writer_id && String(post.writer_id) === user.id;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/posts/${id}/edit`);
  };

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    // TODO: Delete API 호출
    alert("삭제 기능은 아직 구현 중입니다.");
  };

  if (isLoading) {
    return (
      <CommunityLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PostsLoadingState />
        </div>
      </CommunityLayout>
    );
  }

  if (error || !post) {
    return (
      <CommunityLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PostsErrorState
            message={error?.message ?? "게시글을 찾을 수 없습니다."}
            onRetry={() => window.location.reload()}
          />
        </div>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 뒤로가기 버튼 */}
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Button>

        {/* 게시글 상세 */}
        <PostDetail
          post={post}
          canEdit={Boolean(canEdit)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* TODO: 댓글 섹션 (Epic #151) */}
        {/* TODO: 반응 버튼 (Epic #152) */}
      </div>
    </CommunityLayout>
  );
}
