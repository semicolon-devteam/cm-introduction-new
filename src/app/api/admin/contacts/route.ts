/**
 * Admin Contacts API Routes
 */

import { NextRequest, NextResponse } from "next/server";

import { ContactsRepository } from "@/app/contacts/_repositories";

import type { InquiryStatus } from "@/lib/supabase/database.types";

const repository = new ContactsRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as InquiryStatus | null;

    const result = await repository.getContacts({
      status: status ?? undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Admin Contacts API] GET error:", error);
    return NextResponse.json({ error: "문의 목록 조회 실패" }, { status: 500 });
  }
}
