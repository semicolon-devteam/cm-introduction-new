/**
 * Leader Domain Types
 * 리더 프로필 관련 타입 정의
 */

import type { CareerItem, SocialLinks } from "@/lib/supabase/database.types";

/**
 * 리더 프로필 정보
 */
export interface Leader {
  id: number;
  slug: string;
  name: string;
  nickname: string | null;
  position: string;
  summary: string | null;
  career: CareerItem[];
  profileImage: string | null;
  message: string | null;
  skills: string[];
  socialLinks: SocialLinks;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * 리더 목록 조회 파라미터
 */
export interface GetLeadersParams {
  includeInactive?: boolean;
}

/**
 * 리더 목록 조회 응답
 */
export interface GetLeadersResponse {
  leaders: Leader[];
  total: number;
}

/**
 * 리더 생성 파라미터
 */
export interface CreateLeaderParams {
  slug: string;
  name: string;
  nickname?: string | null;
  position: string;
  summary?: string | null;
  career?: CareerItem[];
  profileImage?: string | null;
  message?: string | null;
  skills?: string[];
  socialLinks?: SocialLinks;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * 리더 수정 파라미터
 */
export interface UpdateLeaderParams {
  slug?: string;
  name?: string;
  nickname?: string | null;
  position?: string;
  summary?: string | null;
  career?: CareerItem[];
  profileImage?: string | null;
  message?: string | null;
  skills?: string[];
  socialLinks?: SocialLinks;
  isActive?: boolean;
  displayOrder?: number;
}
