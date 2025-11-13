/**
 * 사이드바 API 인터페이스
 * Spring Boot / Next.js 구현체가 모두 준수해야 함
 */

import type { TrendingTopic, CommunityStat } from '@/models/sidebar.types';

/**
 * Sidebar Service Interface
 */
export interface ISidebarService {
  /**
   * 사이드바 데이터 조회 (트렌딩 토픽 + 커뮤니티 통계)
   * @returns 트렌딩 토픽과 커뮤니티 통계
   */
  getSidebarData(): Promise<{
    trendingTopics: TrendingTopic[];
    communityStats: CommunityStat[];
  }>;
}
