/**
 * Contact Status Update API Route
 *
 * PATCH /api/contacts/[id]/status - 문의 상태 업데이트 (관리자용)
 */

import { NextRequest, NextResponse } from "next/server";

import { ContactsRepository } from "@/app/contacts/_repositories";
import type { InquiryStatus } from "@/lib/supabase/database.types";

const VALID_STATUSES: InquiryStatus[] = [
  "NEW",
  "ACK",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const repository = new ContactsRepository();
    const result = await repository.updateContactStatus({
      id: contactId,
      status: body.status,
      adminNotes: body.adminNotes,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Contact status PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update contact status" },
      { status: 500 }
    );
  }
}
