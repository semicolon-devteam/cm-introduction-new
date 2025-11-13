/**
 * useActivities Hook 단위 테스트
 * React 상태 관리 및 API 호출 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { useActivities } from '../useActivities';

import type {
  GetActivitiesParams,
  GetActivitiesResponse,
  Activity,
} from '@/models/activity.types';

// Mock activityClient
vi.mock('@/app/dashboard/_api-clients', () => ({
  activityClient: {
    getActivities: vi.fn(),
  },
}));

// Import after mock
import { activityClient } from '@/app/dashboard/_api-clients';

// Helper to create mock activity
const createMockActivity = (id: number): Activity => ({
  id: id.toString(),
  type: 'post_created',
  title: '새 게시글 작성',
  description: `Test Post ${id}`,
  createdAt: '2025-01-01T00:00:00Z',
  link: `/posts/${id}`,
  icon: 'FileText',
});

// Helper to create mock response
const createMockResponse = (
  override?: Partial<GetActivitiesResponse>,
): GetActivitiesResponse => ({
  activities: [createMockActivity(1)],
  total: 1,
  ...override,
});

describe('useActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(activityClient.getActivities).mockResolvedValue(createMockResponse());
  });

  describe('초기 로딩', () => {
    it('초기 상태는 로딩 중이다', () => {
      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.activities).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('데이터 로딩이 완료되면 활동을 반환한다', async () => {
      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.activities).toHaveLength(1);
      expect(result.current.activities[0]).toHaveProperty('id', '1');
      expect(result.current.activities[0]).toHaveProperty('type', 'post_created');
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('에러 발생 시 에러를 반환한다', async () => {
      const errorMessage = 'Failed to fetch activities';
      vi.mocked(activityClient.getActivities).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.activities).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  describe('파라미터 처리', () => {
    it('userId로 필터링한다', async () => {
      const params: GetActivitiesParams = { userId: 'user-123', limit: 5 };
      const { result } = renderHook(() => useActivities(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(activityClient.getActivities).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          limit: 5,
        }),
      );
    });

    it('limit 값을 적용한다', async () => {
      const params: GetActivitiesParams = { userId: 'user-123', limit: 10 };
      const { result } = renderHook(() => useActivities(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(activityClient.getActivities).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          limit: 10,
        }),
      );
    });

    it('type 필터를 적용한다', async () => {
      const params: GetActivitiesParams = {
        userId: 'user-123',
        limit: 5,
        type: 'post_created',
      };
      const { result } = renderHook(() => useActivities(params));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(activityClient.getActivities).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          limit: 5,
          type: 'post_created',
        }),
      );
    });
  });

  describe('데이터 새로고침', () => {
    it('refetch로 데이터를 다시 로드한다', async () => {
      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(activityClient.getActivities).mock.calls.length;

      await result.current.refetch();

      await waitFor(() => {
        expect(vi.mocked(activityClient.getActivities).mock.calls.length).toBe(
          callCountBefore + 1,
        );
      });
    });

    it('refetch 중 에러가 발생하면 에러 상태를 업데이트한다', async () => {
      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      vi.mocked(activityClient.getActivities).mockRejectedValueOnce(
        new Error('Refetch failed'),
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBe('Refetch failed');
      });
    });
  });

  describe('상태 관리', () => {
    it('여러 활동을 올바르게 저장한다', async () => {
      vi.mocked(activityClient.getActivities).mockResolvedValue(
        createMockResponse({
          activities: [createMockActivity(1), createMockActivity(2), createMockActivity(3)],
          total: 3,
        }),
      );

      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.activities).toHaveLength(3);
      expect(result.current.total).toBe(3);
    });

    it('활동이 없을 경우 빈 배열을 반환한다', async () => {
      vi.mocked(activityClient.getActivities).mockResolvedValue(
        createMockResponse({
          activities: [],
          total: 0,
        }),
      );

      const { result } = renderHook(() =>
        useActivities({ userId: 'user-123', limit: 5 }),
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.activities).toEqual([]);
      expect(result.current.total).toBe(0);
    });
  });

  describe('파라미터 변경 시 재조회', () => {
    it('userId 변경 시 재조회한다', async () => {
      const { result, rerender } = renderHook(
        ({ userId, limit }: GetActivitiesParams) => useActivities({ userId, limit }),
        {
          initialProps: { userId: 'user-123', limit: 5 },
        },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(activityClient.getActivities).mock.calls.length;

      rerender({ userId: 'user-456', limit: 5 });

      await waitFor(() => {
        expect(vi.mocked(activityClient.getActivities).mock.calls.length).toBe(
          callCountBefore + 1,
        );
      });

      expect(activityClient.getActivities).toHaveBeenLastCalledWith(
        expect.objectContaining({
          userId: 'user-456',
        }),
      );
    });

    it('limit 변경 시 재조회한다', async () => {
      const { result, rerender } = renderHook(
        ({ userId, limit }: GetActivitiesParams) => useActivities({ userId, limit }),
        {
          initialProps: { userId: 'user-123', limit: 5 },
        },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callCountBefore = vi.mocked(activityClient.getActivities).mock.calls.length;

      rerender({ userId: 'user-123', limit: 10 });

      await waitFor(() => {
        expect(vi.mocked(activityClient.getActivities).mock.calls.length).toBe(
          callCountBefore + 1,
        );
      });

      expect(activityClient.getActivities).toHaveBeenLastCalledWith(
        expect.objectContaining({
          limit: 10,
        }),
      );
    });
  });
});
