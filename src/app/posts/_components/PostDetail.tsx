/**
 * 게시글 상세 컴포넌트
 * - 게시글 전체 내용 표시
 * - 작성자 정보
 * - 통계 정보
 */

import { Eye, ThumbsUp, ThumbsDown, MessageCircle, Calendar, User } from "lucide-react";
import Image from "next/image";

import { Badge } from "@atoms/Badge";
import { Button } from "@atoms/Button";
import { Card, CardContent, CardHeader } from "@atoms/Card";

import type { PostDetail as PostDetailType } from "@models/posts.types";

interface PostDetailProps {
  post: PostDetailType;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export function PostDetail({ post, onEdit, onDelete, canEdit = false }: PostDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        {/* 게시판 및 공지사항 배지 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">{post.board_name ?? "일반"}</Badge>
          {post.is_notice && <Badge variant="default">공지사항</Badge>}
          {post.is_secret && <Badge variant="outline">비밀글</Badge>}
        </div>

        {/* 제목 */}
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

        {/* 작성자 및 작성일 */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.is_anonymous ? "익명" : (post.writer_name ?? "알 수 없음")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.view_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.like_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" />
              <span>{post.dislike_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comment_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 수정/삭제 버튼 */}
        {canEdit && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={onEdit}>
              수정
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              삭제
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 썸네일 */}
        {post.thumbnail && (
          <div className="w-full rounded-lg overflow-hidden relative aspect-video">
            <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* 본문 */}
        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* 첨부파일 */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-3">첨부파일</h3>
            <div className="space-y-2">
              {post.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 수정 정보 */}
        {post.updated_at && post.updated_at !== post.created_at && (
          <div className="text-xs text-muted-foreground border-t pt-4">
            마지막 수정: {formatDate(post.updated_at)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
