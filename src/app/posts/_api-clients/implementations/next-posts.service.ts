/**
 * Next.js API 게시물 서비스 구현체
 * Spring Boot가 없는 로컬 개발 환경에서 사용
 * Next.js API Route를 통해 Supabase에 접근
 */

import type { Post, PostDetail, GetPostsParams, GetPostsResponse } from "@/models/posts.types";
import type { IPostsService } from "../interfaces/posts.interface";

export class NextPostsService implements IPostsService {
  /**
   * 게시글 목록 조회
   * Next.js API Route 호출 (네트워크 1회)
   */
  async getPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    const queryParams = new URLSearchParams();

    // 파라미터 변환
    if (params.boardId) queryParams.set("boardId", String(params.boardId));
    if (params.search) queryParams.set("search", params.search);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.page) queryParams.set("page", String(params.page));
    if (params.limit) queryParams.set("limit", String(params.limit));
    if (params.includeNotice !== undefined) {
      queryParams.set("includeNotice", String(params.includeNotice));
    }

    const response = await fetch(`/api/posts?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    return response.json();
  }

  /**
   * 게시글 상세 조회
   * Next.js API Route 호출 (네트워크 1회)
   */
  async getPostById(id: number): Promise<PostDetail> {
    const response = await fetch(`/api/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Post not found");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch post");
    }

    return response.json();
  }

  /**
   * 게시글 생성
   */
  async createPost(post: Partial<Post>): Promise<Post> {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create post");
    }

    return response.json();
  }

  /**
   * 게시글 수정
   */
  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update post");
    }

    return response.json();
  }

  /**
   * 게시글 삭제
   */
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete post");
    }
  }
}
