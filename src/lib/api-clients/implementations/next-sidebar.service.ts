/**
 * Next.js API Sidebar 서비스 구현체
 * Spring Boot가 없는 로컬 개발 환경에서 사용
 */

import type { TrendingTopic, CommunityStat } from "@/models/sidebar.types";
import type { ISidebarService } from "../interfaces/sidebar.interface";

export class NextSidebarService implements ISidebarService {
  /**
   * 사이드바 데이터 조회
   * Next.js API Route 호출
   */
  async getSidebarData(): Promise<{
    trendingTopics: TrendingTopic[];
    communityStats: CommunityStat[];
  }> {
    const response = await fetch("/api/sidebar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch sidebar data");
    }

    return response.json();
  }
}
