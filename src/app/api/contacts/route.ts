/**
 * Contacts API Route
 *
 * GET /api/contacts - 문의 목록 조회 (관리자용)
 * POST /api/contacts - 문의 생성 (외부 폼 제출)
 */

import { NextRequest, NextResponse } from "next/server";

import { ContactsRepository } from "@/app/contacts/_repositories";
import type { InquiryStatus } from "@/lib/supabase/database.types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as InquiryStatus | null;
    const limit = searchParams.get("limit");

    const repository = new ContactsRepository();
    const result = await repository.getContacts({
      status: status ?? undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Contacts GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const repository = new ContactsRepository();
    const result = await repository.createContact({
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      company: body.company ?? null,
      message: body.message,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API] Contacts POST error:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
