/**
 * Sidebar 관련 상수 정의
 * Development Philosophy: Magic strings should use constants
 */

import type { QuickLink } from '@/models/sidebar.types';

/**
 * 빠른 링크 목록
 * - 변경되지 않는 정적 데이터
 * - as const로 타입 추론 최적화
 */
export const QUICK_LINKS: readonly QuickLink[] = [
  { icon: 'Bookmark', label: '북마크', href: '/bookmarks' },
  { icon: 'TrendingUp', label: '인기글', href: '/trending' },
  { icon: 'Calendar', label: '최신글', href: '/recent' },
  { icon: 'Hash', label: '태그', href: '/tags' },
  { icon: 'HelpCircle', label: '도움말', href: '/help' },
] as const;

/**
 * 데이터 갱신 주기 (밀리초)
 */
export const SIDEBAR_REFRESH_INTERVAL = 5 * 60 * 1000; // 5분

/**
 * 인기글 기준 (최소 조회수)
 */
export const TRENDING_TOPIC_LIMIT = 5;

/**
 * 이번 주 인기글 최소 조회수 기준
 */
export const WEEKLY_POPULAR_MIN_VIEWS = 50;
