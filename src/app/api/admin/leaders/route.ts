/**
 * Admin Leaders API Routes
 * POST: 리더 생성
 * GET: 리더 목록 조회 (비활성 포함)
 */

import { NextRequest, NextResponse } from "next/server";

import { LeadersRepository } from "@/app/leaders/_repositories";

const repository = new LeadersRepository();

export async function GET() {
  try {
    const result = await repository.getLeaders({ includeInactive: true });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Leaders API] GET error:", error);
    return NextResponse.json(
      { error: "리더 목록 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.slug || !body.name || !body.position) {
      return NextResponse.json(
        { error: "slug, name, position은 필수입니다" },
        { status: 400 }
      );
    }

    const leader = await repository.createLeader(body);
    return NextResponse.json({ leader }, { status: 201 });
  } catch (error) {
    console.error("[Admin Leaders API] POST error:", error);
    return NextResponse.json(
      { error: "리더 생성 실패" },
      { status: 500 }
    );
  }
}
