/**
 * Spring Boot Profile Service Implementation
 * Development Philosophy: Spring Boot API 직접 호출 (프로덕션용, 1-Hop Rule)
 */

import type { IProfileService } from "../interfaces/profile.interface";
import type { GetProfileResponse, UpdateProfileParams, UserProfile } from "@/models/profile.types";

/**
 * Spring Boot Profile Service
 * Spring Boot Backend를 직접 호출 (1-Hop)
 */
export class SpringProfileService implements IProfileService {
  private readonly baseURL = process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080";

  async getProfile(authUserId: string): Promise<GetProfileResponse> {
    const response = await fetch(`${this.baseURL}/api/profile?authUserId=${authUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    return response.json();
  }

  async updateProfile(params: UpdateProfileParams): Promise<UserProfile> {
    const response = await fetch(`${this.baseURL}/api/profile`, {
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
