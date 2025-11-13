/**
 * Sidebar 관련 TypeScript 타입 정의
 * Development Philosophy: TypeScript for all prop definitions
 */

/**
 * 인기 토픽 타입
 */
export interface TrendingTopic {
  /** 토픽 제목 */
  name: string;
  /** 조회수 또는 인기도 수치 */
  count: number;
  /** 게시물 ID (선택적, 링크용) */
  postId?: number;
}

/**
 * 커뮤니티 통계 아이콘 타입
 */
export type CommunityStatIcon = 'Users' | 'Calendar' | 'Trophy';

/**
 * 커뮤니티 통계 항목
 */
export interface CommunityStat {
  /** 통계 레이블 */
  label: string;
  /** 통계 값 (포맷팅된 문자열) */
  value: string;
  /** 아이콘 타입 */
  icon: CommunityStatIcon;
}

/**
 * 빠른 링크 아이콘 타입
 */
export type QuickLinkIcon =
  | 'Bookmark'
  | 'TrendingUp'
  | 'Calendar'
  | 'Hash'
  | 'HelpCircle';

/**
 * 빠른 링크 항목
 */
export interface QuickLink {
  /** 아이콘 타입 */
  icon: QuickLinkIcon;
  /** 링크 레이블 */
  label: string;
  /** 링크 경로 */
  href: string;
}

/**
 * Sidebar 데이터 조회 결과
 */
export interface SidebarData {
  /** 인기 토픽 목록 */
  trendingTopics: TrendingTopic[];
  /** 커뮤니티 통계 */
  communityStats: CommunityStat[];
  /** 빠른 링크 목록 (상수) */
  quickLinks: QuickLink[];
}

/**
 * Supabase posts 테이블 조회 결과 (인기 토픽용)
 */
export interface PostForTrending {
  id: number;
  title: string;
  view_count: number;
  board_id: number;
}

/**
 * 숫자 포맷팅 옵션
 */
export interface FormatNumberOptions {
  /** 천 단위 구분자 사용 여부 */
  useComma?: boolean;
  /** 약어 사용 여부 (12.5K, 1.2M 등) */
  useShorthand?: boolean;
}
