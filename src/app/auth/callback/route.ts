import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@lib/supabase/server";

/**
 * OAuth 콜백 라우트
 * Supabase OAuth 인증 후 리다이렉트되는 엔드포인트
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createServerSupabaseClient();

    // 인증 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 성공 시 대시보드로 리다이렉트
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // 오류 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
