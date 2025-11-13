/**
 * Next.js Profile Service Implementation
 * Development Philosophy: Next.js API Route 호출 (로컬 개발용)
 */

import type { IProfileService } from "../interfaces/profile.interface";
import type { GetProfileResponse, UpdateProfileParams, UserProfile } from "@/models/profile.types";

/**
 * Next.js Profile Service
 * Next.js API Routes를 통해 데이터 조회/수정
 */
export class NextProfileService implements IProfileService {
  async getProfile(authUserId: string): Promise<GetProfileResponse> {
    const response = await fetch(`/api/profile?authUserId=${authUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 항상 최신 데이터
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    return response.json();
  }

  async updateProfile(params: UpdateProfileParams): Promise<UserProfile> {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update profile");
    }

    const data = await response.json();
    return data.profile;
  }
}
