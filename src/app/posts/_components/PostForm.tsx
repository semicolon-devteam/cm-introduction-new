/**
 * 게시글 작성/수정 폼 컴포넌트
 */

"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@atoms/Card";
import { Button } from "@atoms/Button";
import { Input } from "@atoms/Input";
import { Textarea } from "@atoms/Textarea";

import type { PostDetail } from "@models/posts.types";

interface PostFormProps {
  initialData?: Partial<PostDetail>;
  onSubmit: (data: {
    title: string;
    content: string;
    board_id: number;
    is_secret?: boolean;
    is_anonymous?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PostForm({ initialData, onSubmit, onCancel, isSubmitting = false }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [boardId] = useState(initialData?.board_id ?? 10); // 기본값: "홈" 게시판 (id: 10)
  const [isSecret, setIsSecret] = useState(initialData?.is_secret ?? false);
  const [isAnonymous, setIsAnonymous] = useState(initialData?.is_anonymous ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    void onSubmit({
      title: title.trim(),
      content: content.trim(),
      board_id: boardId,
      is_secret: isSecret,
      is_anonymous: isAnonymous,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? "게시글 수정" : "새 게시글 작성"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={200}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">{title.length} / 200자</p>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={15}
              required
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{content.length}자</p>
          </div>

          {/* 옵션 */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(e) => setIsSecret(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4"
              />
              <span className="text-sm">비밀글</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4"
              />
              <span className="text-sm">익명</span>
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : initialData ? "수정" : "작성"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
