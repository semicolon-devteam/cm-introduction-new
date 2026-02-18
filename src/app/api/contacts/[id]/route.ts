/**
 * Single Contact API Route
 *
 * GET /api/contacts/[id] - 단일 문의 조회
 */

import { NextRequest, NextResponse } from "next/server";

import { ContactsRepository } from "@/app/contacts/_repositories";

export async function GET(
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

    const repository = new ContactsRepository();
    const result = await repository.getContactById(contactId);

    if (!result) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Contact GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}
