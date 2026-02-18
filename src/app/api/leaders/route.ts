/**
 * Leaders API Route
 * GET /api/leaders - 리더 목록 조회
 */

import { NextRequest, NextResponse } from "next/server";

import { LeadersRepository } from "@/app/leaders/_repositories";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const repository = new LeadersRepository();
    const result = await repository.getLeaders({
      includeInactive,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Leaders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaders" },
      { status: 500 }
    );
  }
}
