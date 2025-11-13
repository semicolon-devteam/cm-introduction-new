"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@lib/supabase/server";

import type { Provider } from "@supabase/supabase-js";

export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
}

/**
 * 서버 액션: 이메일/비밀번호로 로그인
 * @deprecated Use loginAction instead
 */
export async function signInAction(email: string, password: string): Promise<ActionResponse> {
  return loginAction(email, password);
}

/**
 * 서버 액션: 회원가입
 */
export async function signUpAction(
  email: string,
  password: string,
  metadata?: Record<string, string>,
): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * 서버 액션: 로그아웃
 */
export async function signOutAction(): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * 서버 액션: 비밀번호 재설정 이메일 전송
 */
export async function resetPasswordAction(email: string): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { data: { message: "비밀번호 재설정 이메일을 전송했습니다." } };
}

/**
 * 서버 액션: 비밀번호 업데이트
 */
export async function updatePasswordAction(newPassword: string): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data: { message: "비밀번호가 성공적으로 변경되었습니다." } };
}

/**
 * 서버 액션: 현재 사용자 정보 가져오기
 */
export async function getCurrentUserAction() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { error: error.message };
  }

  return { data: user };
}

/**
 * 서버 액션: 사용자 프로필 업데이트
 */
export async function updateProfileAction(
  updates: Record<string, unknown>,
): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  // 현재 사용자 확인
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "인증되지 않은 사용자입니다." };
  }

  // 프로필 업데이트
  const { error } = await supabase
    .from("users")
    .update(updates as never)
    .eq("auth_user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile", "page");
  return { data: { message: "프로필이 성공적으로 업데이트되었습니다." } };
}

/**
 * 서버 액션: 이메일/비밀번호 로그인 (폼 액션용)
 */
export async function loginAction(email: string, password: string): Promise<ActionResponse> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { data };
}

/**
 * 서버 액션: OAuth 로그인
 */
export async function loginWithOAuthAction(
  provider: Provider,
): Promise<ActionResponse & { url?: string }> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    return { data, url: data.url };
  }

  return { error: "OAuth URL을 생성할 수 없습니다." };
}
