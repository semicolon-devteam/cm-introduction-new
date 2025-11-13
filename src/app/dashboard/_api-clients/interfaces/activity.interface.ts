/**
 * Activity Service Interface
 * Development Philosophy: Interface segregation principle
 */

import type { GetActivitiesParams, GetActivitiesResponse } from '@/models/activity.types';

/**
 * Activity Service 인터페이스
 * Spring Boot / Next.js API 구현체가 이 인터페이스를 따름
 */
export interface IActivityService {
  /**
   * 사용자 활동 목록 조회
   */
  getActivities(params: GetActivitiesParams): Promise<GetActivitiesResponse>;
}
