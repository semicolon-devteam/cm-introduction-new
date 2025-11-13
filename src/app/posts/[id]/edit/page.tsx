/**
 * 게시글 수정 페이지
 */

"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import { CommunityLayout } from "@templates/CommunityLayout";
import { useAuth } from "@hooks/auth";
import { usePost } from "@/app/posts/_hooks";
import { postsClient } from "@/app/posts/_api-clients";
import { PostForm, PostsLoadingState, PostsErrorState } from "@/app/posts/_components";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const postId = Number(id);

  const { post, isLoading, error } = usePost(postId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 확인
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async (data: {
    title: string;
    content: string;
    board_id: number;
    is_secret?: boolean;
    is_anonymous?: boolean;
  }) => {
    try {
      setIsSubmitting(true);

      await postsClient.updatePost(postId, data);

      alert("게시글이 수정되었습니다.");
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("수정을 취소하시겠습니까?")) {
      router.back();
    }
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

  // 작성자 확인
  if (post.writer_id && String(post.writer_id) !== user.id) {
    return (
      <CommunityLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PostsErrorState
            message="게시글을 수정할 권한이 없습니다."
            onRetry={() => router.back()}
          />
        </div>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </CommunityLayout>
  );
}
