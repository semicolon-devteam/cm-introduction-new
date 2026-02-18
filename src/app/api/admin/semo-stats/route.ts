/**
 * SEMO Stats API Route
 *
 * GET /api/admin/semo-stats
 *
 * Query Parameters:
 * - range: "7d" | "30d" | "90d" | "custom" (default: "30d")
 * - startDate: ISO date string (custom일 때)
 * - endDate: ISO date string (custom일 때)
 */

import { NextRequest, NextResponse } from "next/server";

import { SemoStatsRepository } from "@/app/admin/semo-stats/_repositories";

import type { DateRange } from "@/app/admin/semo-stats/_api-clients";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") || "30d") as DateRange;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    // Validate range
    const validRanges: DateRange[] = ["7d", "30d", "90d", "custom"];
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        { error: "Invalid range parameter. Must be 7d, 30d, 90d, or custom" },
        { status: 400 }
      );
    }

    // Validate custom range
    if (range === "custom") {
      if (!startDate || !endDate) {
        return NextResponse.json(
          {
            error:
              "startDate and endDate are required for custom range",
          },
          { status: 400 }
        );
      }
    }

    const repository = new SemoStatsRepository();
    const stats = await repository.getStats({
      range,
      startDate,
      endDate,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[API] SEMO Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch SEMO stats" },
      { status: 500 }
    );
  }
}
