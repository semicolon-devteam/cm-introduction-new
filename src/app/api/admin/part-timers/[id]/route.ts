/**
 * Admin Part-Timer Detail API Routes
 */

import { NextRequest, NextResponse } from "next/server";

import { PartTimersRepository } from "@/app/part-timers/_repositories";

const repository = new PartTimersRepository();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const partTimerId = parseInt(id, 10);

    if (isNaN(partTimerId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const partTimer = await repository.getPartTimerById(partTimerId);

    if (!partTimer) {
      return NextResponse.json({ error: "파트타이머를 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ partTimer });
  } catch (error) {
    console.error("[Admin PartTimers API] GET error:", error);
    return NextResponse.json({ error: "파트타이머 조회 실패" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const partTimerId = parseInt(id, 10);

    if (isNaN(partTimerId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const body = await request.json();
    const partTimer = await repository.updatePartTimer(partTimerId, body);

    return NextResponse.json({ partTimer });
  } catch (error) {
    console.error("[Admin PartTimers API] PUT error:", error);
    return NextResponse.json({ error: "파트타이머 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const partTimerId = parseInt(id, 10);

    if (isNaN(partTimerId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    await repository.deletePartTimer(partTimerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin PartTimers API] DELETE error:", error);
    return NextResponse.json({ error: "파트타이머 삭제 실패" }, { status: 500 });
  }
}
