import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@lib/supabase/server";

/**
 * 닉네임 중복 검사 API
 * POST /api/auth/check-nickname
 */
export async function POST(request: Request) {
  try {
    const { nickname } = await request.json();

    // 닉네임 유효성 검사
    if (!nickname || nickname.trim().length < 2) {
      return NextResponse.json(
        { available: false, error: "닉네임은 최소 2자 이상이어야 합니다." },
        { status: 400 },
      );
    }

    if (nickname.length > 20) {
      return NextResponse.json(
        { available: false, error: "닉네임은 20자 이하여야 합니다." },
        { status: 400 },
      );
    }

    // 특수문자 검사 (한글, 영문, 숫자, 언더스코어만 허용)
    const nicknameRegex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!nicknameRegex.test(nickname)) {
      return NextResponse.json(
        { available: false, error: "닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용 가능합니다." },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();

    // users 테이블에서 닉네임 중복 확인
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname.trim())
      .maybeSingle();

    if (error) {
      console.error("Nickname check error:", error);
      return NextResponse.json(
        { available: false, error: "닉네임 확인 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    // 중복 여부 반환
    const available = !existingUser;

    return NextResponse.json({
      available,
      message: available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { available: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
