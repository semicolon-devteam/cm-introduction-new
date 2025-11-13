/**
 * 게시글 작성 페이지
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { CommunityLayout } from "@templates/CommunityLayout";
import { useAuth } from "@hooks/auth";
import { postsClient } from "@/app/posts/_api-clients";
import { PostForm } from "@/app/posts/_components";

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();
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

      const post = await postsClient.createPost(data);

      alert("게시글이 작성되었습니다.");
      router.push(`/posts/${post.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("작성을 취소하시겠습니까?")) {
      router.back();
    }
  };

  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </CommunityLayout>
  );
}
