/**
 * Admin Contact Detail API Routes
 */

import { NextRequest, NextResponse } from "next/server";

import { ContactsRepository } from "@/app/contacts/_repositories";

import type { InquiryStatus } from "@/lib/supabase/database.types";

const repository = new ContactsRepository();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);

    if (isNaN(contactId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const contact = await repository.getContactById(contactId);

    if (!contact) {
      return NextResponse.json({ error: "문의를 찾을 수 없습니다" }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[Admin Contacts API] GET error:", error);
    return NextResponse.json({ error: "문의 조회 실패" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);

    if (isNaN(contactId)) {
      return NextResponse.json({ error: "잘못된 ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status, adminNotes } = body as {
      status?: InquiryStatus;
      adminNotes?: string;
    };

    if (!status) {
      return NextResponse.json({ error: "status는 필수입니다" }, { status: 400 });
    }

    const contact = await repository.updateContactStatus({
      id: contactId,
      status,
      adminNotes,
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[Admin Contacts API] PUT error:", error);
    return NextResponse.json({ error: "문의 상태 업데이트 실패" }, { status: 500 });
  }
}
