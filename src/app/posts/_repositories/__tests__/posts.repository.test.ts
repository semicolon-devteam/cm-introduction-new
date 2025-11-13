/**
 * PostsRepository 단위 테스트
 * 서버사이드 데이터 접근 계층 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { PostsRepository } from '../posts.repository';

import type { GetPostsParams } from '@/models/posts.types';

// Create chainable mock
const createChainableMock = () => {
  const mock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn(),
    single: vi.fn(),
    update: vi.fn().mockReturnThis(),
  };

  // Default successful response for range (list queries)
  mock.range.mockResolvedValue({
    data: [
      {
        id: 1,
        board_id: 1,
        title: 'Test Post',
        content: 'Test Content',
        writer_id: 'user-1',
        writer_name: 'Test User',
        view_count: 10,
        comment_count: 5,
        like_count: 3,
        dislike_count: 0,
        is_notice: false,
        is_secret: false,
        is_anonymous: false,
        status: 'published',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        boards: { name: 'Test Board' },
      },
    ],
    error: null,
    count: 1,
  });

  // Default successful response for single (detail queries)
  mock.single.mockResolvedValue({
    data: {
      id: 1,
      board_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      writer_id: 'user-1',
      writer_name: 'Test User',
      view_count: 10,
      comment_count: 5,
      like_count: 3,
      dislike_count: 0,
      is_notice: false,
      is_secret: false,
      is_anonymous: false,
      status: 'published',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      boards: { name: 'Test Board' },
    },
    error: null,
  });

  return mock;
};

// Supabase client mock
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => createChainableMock()),
  })),
}));

describe('PostsRepository', () => {
  let repository: PostsRepository;

  beforeEach(() => {
    repository = new PostsRepository();
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('게시글 목록을 조회한다', async () => {
      const params: GetPostsParams = {
        page: 1,
        limit: 20,
        sortBy: 'latest',
      };

      const result = await repository.getPosts(params);

      expect(result).toMatchObject({
        posts: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        limit: 20,
        totalPages: expect.any(Number),
        hasNext: expect.any(Boolean),
        hasPrev: expect.any(Boolean),
      });
      expect(result.posts.length).toBeGreaterThan(0);
      expect(result.posts[0]).toHaveProperty('id');
      expect(result.posts[0]).toHaveProperty('title');
      expect(result.posts[0]).toHaveProperty('board_name');
    });

    it('기본 파라미터로 게시글을 조회한다', async () => {
      const result = await repository.getPosts();

      expect(result).toMatchObject({
        posts: expect.any(Array),
        page: 1,
        limit: 20,
      });
    });

    it('페이지네이션 정보를 계산한다', async () => {
      const params: GetPostsParams = {
        page: 2,
        limit: 10,
      };

      const result = await repository.getPosts(params);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getPostById', () => {
    it('게시글 상세 정보를 조회한다', async () => {
      const postId = 1;

      const result = await repository.getPostById(postId);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('id', postId);
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('board_name');
    });
  });

  describe('getPostCountByBoard', () => {
    it('게시판별 게시글 개수를 조회한다', async () => {
      const boardId = 1;

      const count = await repository.getPostCountByBoard(boardId);

      expect(count).toBeGreaterThanOrEqual(0);
      expect(typeof count).toBe('number');
    });
  });
});
