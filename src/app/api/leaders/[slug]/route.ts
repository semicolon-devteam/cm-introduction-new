/**
 * Leader Detail API Route
 * GET /api/leaders/[slug] - 단일 리더 조회
 */

import { NextRequest, NextResponse } from "next/server";

import { LeadersRepository } from "@/app/leaders/_repositories";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const repository = new LeadersRepository();
    const leader = await repository.getLeaderBySlug(slug);

    if (!leader) {
      return NextResponse.json(
        { error: "Leader not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ leader });
  } catch (error) {
    console.error("[API] Leader GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leader" },
      { status: 500 }
    );
  }
}
