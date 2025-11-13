/**
 * 게시물 API 인터페이스
 * Spring Boot / Next.js 구현체가 모두 준수해야 함
 *
 * Development Philosophy: Interface Segregation Principle
 */

import type {
  Post,
  PostDetail,
  GetPostsParams,
  GetPostsResponse,
} from '@/models/posts.types';

/**
 * Posts Service Interface
 * 모든 구현체(Spring, Next.js)가 이 인터페이스를 준수
 */
export interface IPostsService {
  /**
   * 게시글 목록 조회
   * @param params 조회 파라미터
   * @returns 게시글 목록 및 페이지네이션 정보
   */
  getPosts(params?: GetPostsParams): Promise<GetPostsResponse>;

  /**
   * 게시글 상세 조회
   * @param id 게시글 ID
   * @returns 게시글 상세 정보
   */
  getPostById(id: number): Promise<PostDetail>;

  /**
   * 게시글 생성
   * @param post 게시글 데이터
   * @returns 생성된 게시글
   */
  createPost(post: Partial<Post>): Promise<Post>;

  /**
   * 게시글 수정
   * @param id 게시글 ID
   * @param post 수정할 데이터
   * @returns 수정된 게시글
   */
  updatePost(id: number, post: Partial<Post>): Promise<Post>;

  /**
   * 게시글 삭제
   * @param id 게시글 ID
   */
  deletePost(id: number): Promise<void>;
}
