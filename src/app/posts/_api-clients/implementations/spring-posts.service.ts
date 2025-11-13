/**
 * Spring Boot API 게시물 서비스 구현체
 * 프로덕션 환경에서 사용
 *
 * TODO: Spring Boot API 완성 시 구현
 */

import type {
  Post,
  PostDetail,
  GetPostsParams,
  GetPostsResponse,
} from '@/models/posts.types';
import type { IPostsService } from '../interfaces/posts.interface';

export class SpringPostsService implements IPostsService {
  private readonly baseURL =
    process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080';

  /**
   * 게시글 목록 조회
   * Spring Boot API 호출 (1-Hop Rule 준수)
   */
  async getPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    const queryParams = new URLSearchParams();

    // Spring Boot API 스펙에 맞춰 파라미터 변환
    // TODO: Spring Boot API 스펙 완성 시 구현
    if (params.boardId) queryParams.set('boardId', String(params.boardId));
    if (params.search) queryParams.set('search', params.search);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.page) queryParams.set('page', String(params.page));
    if (params.limit) queryParams.set('limit', String(params.limit));

    const response = await fetch(
      `${this.baseURL}/api/posts?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Spring Boot API 호출 실패');
    }

    return response.json();
  }

  /**
   * 게시글 상세 조회
   */
  async getPostById(id: number): Promise<PostDetail> {
    const response = await fetch(`${this.baseURL}/api/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Spring Boot API 호출 실패');
    }

    return response.json();
  }

  /**
   * 게시글 생성
   */
  async createPost(post: Partial<Post>): Promise<Post> {
    const response = await fetch(`${this.baseURL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('Spring Boot API 호출 실패');
    }

    return response.json();
  }

  /**
   * 게시글 수정
   */
  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const response = await fetch(`${this.baseURL}/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error('Spring Boot API 호출 실패');
    }

    return response.json();
  }

  /**
   * 게시글 삭제
   */
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Spring Boot API 호출 실패');
    }
  }
}
