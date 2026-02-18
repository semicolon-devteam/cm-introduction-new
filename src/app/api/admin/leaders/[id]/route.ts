/**
 * Admin Leader Detail API Routes
 * GET: 리더 상세 조회
 * PUT: 리더 수정
 * DELETE: 리더 삭제
 */

import { NextRequest, NextResponse } from "next/server";

import { LeadersRepository } from "@/app/leaders/_repositories";

const repository = new LeadersRepository();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leaderId = parseInt(id, 10);

    if (isNaN(leaderId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const leader = await repository.getLeaderById(leaderId);

    if (!leader) {
      return NextResponse.json({ error: "리더를 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ leader });
  } catch (error) {
    console.error("[Admin Leaders API] GET error:", error);
    return NextResponse.json({ error: "리더 조회 실패" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leaderId = parseInt(id, 10);

    if (isNaN(leaderId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const body = await request.json();
    const leader = await repository.updateLeader(leaderId, body);

    return NextResponse.json({ leader });
  } catch (error) {
    console.error("[Admin Leaders API] PUT error:", error);
    return NextResponse.json({ error: "리더 수정 실패" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leaderId = parseInt(id, 10);

    if (isNaN(leaderId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    await repository.deleteLeader(leaderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Leaders API] DELETE error:", error);
    return NextResponse.json({ error: "리더 삭제 실패" }, { status: 500 });
  }
}
