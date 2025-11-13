/**
 * Spring Boot Activity Service Implementation
 * Development Philosophy: Spring Boot API 직접 호출 (프로덕션용, 1-Hop Rule)
 */

import type { IActivityService } from '../interfaces/activity.interface';
import type { GetActivitiesParams, GetActivitiesResponse } from '@/models/activity.types';

/**
 * Spring Boot Activity Service
 * Spring Boot Backend를 직접 호출 (1-Hop)
 */
export class SpringActivityService implements IActivityService {
  private readonly baseURL =
    process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080';

  async getActivities(params: GetActivitiesParams): Promise<GetActivitiesResponse> {
    const queryParams = new URLSearchParams({
      userId: params.userId,
      limit: params.limit?.toString() ?? '5',
    });

    if (params.type) {
      queryParams.append('type', params.type);
    }

    const response = await fetch(
      `${this.baseURL}/api/activities?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch activities');
    }

    return response.json();
  }
}
