/**
 * Part-timers API Route
 *
 * GET /api/part-timers - 파트타이머 목록 조회
 */

import { NextRequest, NextResponse } from "next/server";

import { PartTimersRepository } from "@/app/part-timers/_repositories";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const repository = new PartTimersRepository();
    const result = await repository.getPartTimers({ includeInactive });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Part-timers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch part-timers" },
      { status: 500 }
    );
  }
}
