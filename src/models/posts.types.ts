/**
 * 게시글 관련 TypeScript 타입 정의
 * Development Philosophy: TypeScript for all prop definitions
 *
 * 이 타입은 Supabase posts 테이블 스키마와 정렬되어 있습니다.
 * Database Schema 참조: src/lib/supabase/database.types.ts
 */

import type { Database } from '@/lib/supabase/database.types';

/**
 * Supabase posts 테이블 Row 타입
 */
export type PostRow = Database['public']['Tables']['posts']['Row'];

/**
 * 게시글 상태 (Supabase enum)
 */
export type PostStatus = Database['public']['Enums']['post_status'];

/**
 * 게시글 정렬 옵션 (Frontend용)
 */
export type PostSortBy = 'latest' | 'popular' | 'comments' | 'views';

/**
 * 게시글 기본 정보 (목록용)
 */
export interface Post {
  /** 게시글 ID (bigint) */
  id: number;
  /** 게시판 ID */
  board_id: number;
  /** 게시판 이름 (조인 데이터) */
  board_name?: string;
  /** 카테고리 ID */
  category_id: number | null;
  /** 부모 게시글 ID (답글인 경우) */
  parent_id: number | null;
  /** 제목 */
  title: string;
  /** 내용 (목록에서는 일부만) */
  content?: string;
  /** 작성자 ID */
  writer_id: number | null;
  /** 작성자 이름 */
  writer_name: string | null;
  /** 썸네일 이미지 URL */
  thumbnail: string | null;
  /** 첨부파일 JSON */
  attachments: unknown | null;
  /** 제한된 첨부파일 JSON */
  restrict_attachments: unknown | null;
  /** 게시글 상태 */
  status: PostStatus;
  /** 공지사항 여부 */
  is_notice: boolean;
  /** 비밀글 여부 */
  is_secret: boolean;
  /** 익명 여부 */
  is_anonymous: boolean;
  /** 조회수 */
  view_count: number;
  /** 댓글 수 */
  comment_count: number;
  /** 좋아요 수 */
  like_count: number;
  /** 싫어요 수 */
  dislike_count: number;
  /** 다운로드 포인트 */
  download_point: number;
  /** 메타데이터 */
  metadata: Record<string, unknown>;
  /** 생성일시 */
  created_at: string;
  /** 생성자 ID */
  created_by: number | null;
  /** 수정일시 */
  updated_at: string | null;
  /** 수정자 ID */
  updated_by: number | null;
  /** 삭제일시 */
  deleted_at: string | null;
}

/**
 * 게시글 상세 정보
 */
export interface PostDetail extends Post {
  /** 전체 내용 */
  content: string;
  /** 카테고리 ID */
  category_id: number | null;
  /** 부모 게시글 ID (답글인 경우) */
  parent_id: number | null;
  /** 첨부파일 */
  attachments: PostAttachment[] | null;
  /** 메타데이터 */
  metadata: Record<string, unknown>;
}

/**
 * 첨부파일 정보
 */
export interface PostAttachment {
  /** 파일명 */
  name: string;
  /** 파일 URL */
  url: string;
  /** 파일 크기 (bytes) */
  size: number;
  /** MIME 타입 */
  type: string;
}

/**
 * 게시글 목록 조회 파라미터
 */
export interface GetPostsParams {
  /** 게시판 ID (선택) */
  boardId?: number;
  /** 검색어 */
  search?: string;
  /** 정렬 기준 */
  sortBy?: PostSortBy;
  /** 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지당 개수 */
  limit?: number;
  /** 공지사항 포함 여부 */
  includeNotice?: boolean;
}

/**
 * 게시글 목록 응답
 */
export interface GetPostsResponse {
  /** 게시글 목록 */
  posts: Post[];
  /** 전체 개수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지당 개수 */
  limit: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 이전 페이지 존재 여부 */
  hasPrev: boolean;
}

/**
 * 게시글 생성 요청
 */
export interface CreatePostRequest {
  /** 게시판 ID */
  board_id: number;
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 카테고리 ID */
  category_id?: number;
  /** 썸네일 URL */
  thumbnail?: string;
  /** 비밀글 여부 */
  is_secret?: boolean;
  /** 익명 여부 */
  is_anonymous?: boolean;
}

/**
 * 게시글 수정 요청
 */
export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  /** 게시글 ID */
  id: number;
}
