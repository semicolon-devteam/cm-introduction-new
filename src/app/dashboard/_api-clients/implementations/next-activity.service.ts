/**
 * Next.js Activity Service Implementation
 * Development Philosophy: Next.js API Route 호출 (로컬 개발용)
 */

import type { IActivityService } from "../interfaces/activity.interface";
import type { GetActivitiesParams, GetActivitiesResponse } from "@/models/activity.types";

/**
 * Next.js Activity Service
 * Next.js API Routes를 통해 데이터 조회
 */
export class NextActivityService implements IActivityService {
  async getActivities(params: GetActivitiesParams): Promise<GetActivitiesResponse> {
    const queryParams = new URLSearchParams({
      userId: params.userId,
      limit: params.limit?.toString() ?? "5",
    });

    if (params.type) {
      queryParams.append("type", params.type);
    }

    const response = await fetch(`/api/activities?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch activities");
    }

    return response.json();
  }
}
