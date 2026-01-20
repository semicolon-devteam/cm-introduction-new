import { NextRequest, NextResponse } from "next/server";
import { createIssue } from "@/lib/github";

interface SubmitReportRequest {
  type: "po" | "operations" | "revenue" | "goals";
  title: string;
  content: string;
  labels?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitReportRequest = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "제목과 내용은 필수입니다" }, { status: 400 });
    }

    // 리포트 타입에 따른 기본 라벨 설정
    const typeLabels: Record<string, string[]> = {
      po: ["report", "po-weekly"],
      operations: ["report", "operations-weekly"],
      revenue: ["report", "revenue"],
      goals: ["report", "goals"],
    };

    const labels = [...(typeLabels[body.type] || ["report"]), ...(body.labels || [])];

    const issue = await createIssue({
      title: body.title,
      body: body.content,
      labels,
    });

    return NextResponse.json({
      success: true,
      issue: {
        number: issue.number,
        url: issue.html_url,
        title: issue.title,
      },
    });
  } catch (error) {
    console.error("리포트 제출 실패:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "리포트 제출에 실패했습니다",
      },
      { status: 500 },
    );
  }
}
