/**
 * Activity Repository 단위 테스트
 * 서버사이드 Supabase 쿼리 및 데이터 변환 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ActivityRepository } from '../activity.repository';

import type { GetActivitiesParams } from '@/models/activity.types';

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from '@/lib/supabase/server';

// Helper: Chainable mock for Supabase query builder
const createChainableMock = () => {
  const mock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn(),
  };

  mock.limit.mockResolvedValue({
    data: [
      {
        id: 1,
        title: 'Test Post 1',
        created_at: '2025-01-01T00:00:00Z',
        view_count: 10,
      },
      {
        id: 2,
        title: 'Test Post 2',
        created_at: '2025-01-02T00:00:00Z',
        view_count: 20,
      },
    ],
    error: null,
    count: 2,
  });

  return mock;
};

describe('ActivityRepository', () => {
  let repository: ActivityRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ActivityRepository();
  });

  describe('getActivities', () => {
    it('사용자 활동을 조회하고 Activity 형식으로 변환한다', async () => {
      const mockFrom = createChainableMock();
      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const params: GetActivitiesParams = {
        userId: 'user-123',
        limit: 5,
      };

      const result = await repository.getActivities(params);

      // Supabase 쿼리 검증
      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(mockFrom.select).toHaveBeenCalledWith('id, title, created_at, view_count', {
        count: 'exact',
      });
      expect(mockFrom.eq).toHaveBeenCalledWith('author_id', 'user-123');
      expect(mockFrom.eq).toHaveBeenCalledWith('status', 'published');
      expect(mockFrom.is).toHaveBeenCalledWith('deleted_at', null);
      expect(mockFrom.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockFrom.limit).toHaveBeenCalledWith(5);

      // 응답 검증
      expect(result.activities).toHaveLength(2);
      expect(result.total).toBe(2);

      // Activity 변환 검증
      expect(result.activities[0]).toEqual({
        id: '1',
        type: 'post_created',
        title: '새 게시글 작성',
        description: 'Test Post 1',
        createdAt: '2025-01-01T00:00:00Z',
        link: '/posts/1',
        icon: 'FileText',
      });
    });

    it('기본 limit 값(5)을 사용한다', async () => {
      const mockFrom = createChainableMock();
      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const params: GetActivitiesParams = {
        userId: 'user-123',
      };

      await repository.getActivities(params);

      expect(mockFrom.limit).toHaveBeenCalledWith(5);
    });

    it('에러 발생 시 빈 배열을 반환한다', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn(),
      };

      mockFrom.limit.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
        count: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const params: GetActivitiesParams = {
        userId: 'user-123',
        limit: 5,
      };

      const result = await repository.getActivities(params);

      expect(result.activities).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('활동이 없을 경우 빈 배열을 반환한다', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn(),
      };

      mockFrom.limit.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const params: GetActivitiesParams = {
        userId: 'user-123',
        limit: 5,
      };

      const result = await repository.getActivities(params);

      expect(result.activities).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getTotalActivities', () => {
    it('사용자의 총 활동 수를 반환한다', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
      };

      mockFrom.is.mockResolvedValue({
        count: 42,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const result = await repository.getTotalActivities('user-123');

      expect(mockSupabase.from).toHaveBeenCalledWith('posts');
      expect(mockFrom.select).toHaveBeenCalledWith('*', { count: 'exact', head: true });
      expect(mockFrom.eq).toHaveBeenCalledWith('author_id', 'user-123');
      expect(mockFrom.eq).toHaveBeenCalledWith('status', 'published');
      expect(mockFrom.is).toHaveBeenCalledWith('deleted_at', null);

      expect(result).toBe(42);
    });

    it('에러 발생 시 0을 반환한다', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
      };

      mockFrom.is.mockResolvedValue({
        count: null,
        error: { message: 'Database error' },
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const result = await repository.getTotalActivities('user-123');

      expect(result).toBe(0);
    });

    it('활동이 없을 경우 0을 반환한다', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
      };

      mockFrom.is.mockResolvedValue({
        count: 0,
        error: null,
      });

      const mockSupabase = { from: vi.fn(() => mockFrom) };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

      const result = await repository.getTotalActivities('user-123');

      expect(result).toBe(0);
    });
  });
});
