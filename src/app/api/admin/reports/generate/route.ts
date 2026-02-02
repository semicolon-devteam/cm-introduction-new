import { NextResponse } from "next/server";
import { createIssue } from "@/lib/github";

// 리포트를 GitHub 이슈로 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, body: issueBody, labels = [] } = body;

    if (!title || !issueBody) {
      return NextResponse.json(
        { success: false, error: "제목과 내용이 필요합니다" },
        { status: 400 }
      );
    }

    const issue = await createIssue({
      title,
      body: issueBody,
      labels,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
      },
    });
  } catch (error) {
    console.error("리포트 생성 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "리포트 생성에 실패했습니다",
      },
      { status: 500 }
    );
  }
}
