/**
 * Menu API Route
 * Development Philosophy: API Layer (1️⃣)
 *
 * 책임:
 * - HTTP 요청 핸들러 (Controller 역할)
 * - MenuRepository 메서드 호출
 * - 요청 파라미터 검증 및 파싱
 * - 에러 응답 포맷팅
 */

import { NextResponse } from "next/server";

import { MenuRepository } from "@/repositories/menu.repository";

import type { GetMenusParams } from "@/models/menu.types";

/**
 * GET /api/menu
 * 메뉴 목록 조회 (계층 구조)
 *
 * Query Parameters:
 * - device?: 'pc' | 'mobile'
 * - userLevel?: number
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 파라미터 파싱
    const params: GetMenusParams = {};

    const device = searchParams.get("device");
    if (device === "pc" || device === "mobile") {
      params.device = device;
    }

    const userLevel = searchParams.get("userLevel");
    if (userLevel) {
      params.userLevel = parseInt(userLevel, 10);
    }

    // Repository 호출
    const repository = new MenuRepository();
    const menus = await repository.getMenus(params);

    return NextResponse.json({
      menus,
    });
  } catch (error) {
    console.error("[API /menu] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch menu data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
