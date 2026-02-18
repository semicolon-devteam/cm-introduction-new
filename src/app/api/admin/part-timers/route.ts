/**
 * Admin Part-Timers API Routes
 */

import { NextRequest, NextResponse } from "next/server";

import { PartTimersRepository } from "@/app/part-timers/_repositories";

const repository = new PartTimersRepository();

export async function GET() {
  try {
    const result = await repository.getPartTimers({ includeInactive: true });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin PartTimers API] GET error:", error);
    return NextResponse.json({ error: "파트타이머 목록 조회 실패" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.nickname || !body.role) {
      return NextResponse.json({ error: "nickname, role은 필수입니다" }, { status: 400 });
    }

    const partTimer = await repository.createPartTimer(body);
    return NextResponse.json({ partTimer }, { status: 201 });
  } catch (error) {
    console.error("[Admin PartTimers API] POST error:", error);
    return NextResponse.json({ error: "파트타이머 생성 실패" }, { status: 500 });
  }
}
