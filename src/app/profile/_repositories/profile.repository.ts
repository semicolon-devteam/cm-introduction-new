/**
 * Profile Repository
 * Development Philosophy - Repository Layer (2️⃣)
 *
 * 책임:
 * - 서버사이드 데이터 접근 (createServerSupabaseClient 사용)
 * - 사용자 프로필 CRUD 작업
 * - users 테이블 관리
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { UserProfile, UpdateProfileParams, GetProfileResponse } from "@/models/profile.types";

/**
 * Profile Repository 클래스
 * 서버사이드 전용 - API Routes에서만 호출
 */
export class ProfileRepository {
  /**
   * 사용자 프로필 조회
   *
   * @param authUserId - Auth User ID (UUID from Supabase Auth)
   * @returns 프로필 정보
   */
  async getProfile(authUserId: string): Promise<GetProfileResponse> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();

    if (error) {
      console.error("[ProfileRepository] Failed to fetch profile:", error);
      throw new Error("프로필을 불러오는데 실패했습니다.");
    }

    if (!data) {
      throw new Error("프로필을 찾을 수 없습니다.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = data as any;

    return {
      profile: {
        id: profile.id,
        auth_user_id: profile.auth_user_id,
        login_id: profile.login_id,
        email: profile.email,
        nickname: profile.nickname,
        avatar_path: profile.avatar_path,
        status: profile.status,
        permission_type: profile.permission_type,
        activity_level: profile.activity_level,
        info_open_settings: profile.info_open_settings,
        birthdate: profile.birthdate,
        gender: profile.gender,
        phone_number: profile.phone_number,
        invite_code: profile.invite_code,
        invited_by: profile.invited_by,
        nickname_changed_at: profile.nickname_changed_at,
        is_withdrawal_requested: profile.is_withdrawal_requested,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        deleted_at: profile.deleted_at,
      },
    };
  }

  /**
   * 프로필 업데이트
   *
   * @param params - 업데이트 파라미터
   * @returns 업데이트된 프로필 정보
   */
  async updateProfile(params: UpdateProfileParams): Promise<UserProfile> {
    const {
      authUserId,
      nickname,
      avatar_path,
      birthdate,
      gender,
      phone_number,
      info_open_settings,
    } = params;

    const supabase = await createServerSupabaseClient();

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar_path !== undefined) updateData.avatar_path = avatar_path;
    if (birthdate !== undefined) updateData.birthdate = birthdate;
    if (gender !== undefined) updateData.gender = gender;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (info_open_settings !== undefined) updateData.info_open_settings = info_open_settings;

    // Use type assertion on the supabase client itself to bypass restrictive type inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (supabase as any)
      .from("users")
      .update(updateData)
      .eq("auth_user_id", authUserId)
      .select()
      .single();

    const { data, error } = result;

    if (error) {
      console.error("[ProfileRepository] Failed to update profile:", error);
      throw new Error("프로필 업데이트에 실패했습니다.");
    }

    if (!data) {
      throw new Error("업데이트된 프로필을 찾을 수 없습니다.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profile = data as any;

    return {
      id: profile.id,
      auth_user_id: profile.auth_user_id,
      login_id: profile.login_id,
      email: profile.email,
      nickname: profile.nickname,
      avatar_path: profile.avatar_path,
      status: profile.status,
      permission_type: profile.permission_type,
      activity_level: profile.activity_level,
      info_open_settings: profile.info_open_settings,
      birthdate: profile.birthdate,
      gender: profile.gender,
      phone_number: profile.phone_number,
      invite_code: profile.invite_code,
      invited_by: profile.invited_by,
      nickname_changed_at: profile.nickname_changed_at,
      is_withdrawal_requested: profile.is_withdrawal_requested,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      deleted_at: profile.deleted_at,
    };
  }
}
