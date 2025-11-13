/**
 * Spring Boot API Sidebar 서비스 구현체
 * 프로덕션 환경에서 사용
 *
 * TODO: Spring Boot API 완성 시 구현
 */

import type { TrendingTopic, CommunityStat } from '@/models/sidebar.types';
import type { ISidebarService } from '../interfaces/sidebar.interface';

export class SpringSidebarService implements ISidebarService {
  private readonly baseURL =
    process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080';

  /**
   * 사이드바 데이터 조회
   * Spring Boot API 호출 (1-Hop Rule 준수)
   */
  async getSidebarData(): Promise<{
    trendingTopics: TrendingTopic[];
    communityStats: CommunityStat[];
  }> {
    const response = await fetch(`${this.baseURL}/api/sidebar`, {
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
}
