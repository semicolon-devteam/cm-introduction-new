/**
 * Profile API Route
 * Development Philosophy - API Routes Layer (1️⃣)
 *
 * 책임:
 * - HTTP 요청 핸들러 (Controller 역할)
 * - Repository 메서드 호출
 * - 요청 파라미터 검증 및 파싱
 * - 에러 응답 포맷팅
 */

import { NextRequest, NextResponse } from "next/server";

import { ProfileRepository } from "@/app/profile/_repositories";

import type { UpdateProfileParams } from "@/models/profile.types";

/**
 * GET /api/profile?authUserId={authUserId} - 프로필 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authUserId = searchParams.get("authUserId");

    if (!authUserId) {
      return NextResponse.json({ error: "authUserId is required" }, { status: 400 });
    }

    const repository = new ProfileRepository();
    const response = await repository.getProfile(authUserId);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[API /api/profile] GET Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch profile",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/profile - 프로필 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateProfileParams;

    if (!body.authUserId) {
      return NextResponse.json({ error: "authUserId is required" }, { status: 400 });
    }

    const repository = new ProfileRepository();
    const profile = await repository.updateProfile(body);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("[API /api/profile] PUT Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
