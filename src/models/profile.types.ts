/**
 * Profile Domain Types
 * 사용자 프로필 관련 타입 정의
 *
 * 이 타입은 Supabase users 테이블 스키마와 정렬되어 있습니다.
 * Database Schema 참조: src/lib/supabase/database.types.ts
 */

import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase users 테이블 Row 타입
 */
export type UserRow = Database["public"]["Tables"]["users"]["Row"];

/**
 * 사용자 프로필 정보 (Frontend용 간소화 버전)
 */
export interface UserProfile {
  /** 사용자 ID (bigint) */
  id: number;
  /** Auth User ID (UUID) */
  auth_user_id: string | null;
  /** 로그인 ID */
  login_id: string;
  /** 이메일 */
  email: string;
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 경로 */
  avatar_path: string | null;
  /** 사용자 상태 */
  status: Database["public"]["Enums"]["user_status"];
  /** 권한 타입 */
  permission_type: Database["public"]["Enums"]["permission_type"];
  /** 활동 레벨 */
  activity_level: number;
  /** 정보 공개 설정 */
  info_open_settings: {
    open_email?: boolean;
    open_gender?: boolean;
    open_phone_number?: boolean;
    open_birthdate_open?: boolean;
  };
  /** 생년월일 */
  birthdate: string | null;
  /** 성별 */
  gender: Database["public"]["Enums"]["gender"] | null;
  /** 전화번호 */
  phone_number: string | null;
  /** 초대 코드 */
  invite_code: string;
  /** 초대자 ID */
  invited_by: number | null;
  /** 닉네임 변경 시각 */
  nickname_changed_at: string | null;
  /** 탈퇴 요청 여부 */
  is_withdrawal_requested: boolean;
  /** 생성일 */
  created_at: string;
  /** 수정일 */
  updated_at: string | null;
  /** 삭제일 */
  deleted_at: string | null;
}

/**
 * 프로필 업데이트 파라미터
 */
export interface UpdateProfileParams {
  /** Auth User ID (UUID from Supabase Auth) */
  authUserId: string;
  /** 닉네임 */
  nickname?: string;
  /** 프로필 이미지 경로 */
  avatar_path?: string | null;
  /** 생년월일 */
  birthdate?: string | null;
  /** 성별 */
  gender?: Database["public"]["Enums"]["gender"] | null;
  /** 전화번호 */
  phone_number?: string | null;
  /** 정보 공개 설정 */
  info_open_settings?: {
    open_email?: boolean;
    open_gender?: boolean;
    open_phone_number?: boolean;
    open_birthdate_open?: boolean;
  };
}

/**
 * 프로필 조회 응답
 */
export interface GetProfileResponse {
  /** 프로필 정보 */
  profile: UserProfile;
}
