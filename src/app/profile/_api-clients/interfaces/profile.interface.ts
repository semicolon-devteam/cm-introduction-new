/**
 * Profile Service Interface
 * Development Philosophy: Interface segregation principle
 */

import type { GetProfileResponse, UpdateProfileParams, UserProfile } from "@/models/profile.types";

/**
 * Profile Service 인터페이스
 * Spring Boot / Next.js API 구현체가 이 인터페이스를 따름
 */
export interface IProfileService {
  /**
   * 프로필 조회
   * @param authUserId - Auth User ID (UUID from Supabase Auth)
   */
  getProfile(authUserId: string): Promise<GetProfileResponse>;

  /**
   * 프로필 업데이트
   */
  updateProfile(params: UpdateProfileParams): Promise<UserProfile>;
}
