import { NextRequest, NextResponse } from "next/server";
import { getBugIssues, checkGitHubConnection } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = (searchParams.get("state") as "open" | "closed" | "all") || "open";
    const labels = searchParams.get("labels")?.split(",") || ["bug"];
    const page = parseInt(searchParams.get("page") || "1", 10);
    const per_page = parseInt(searchParams.get("per_page") || "30", 10);

    const issues = await getBugIssues({
      state,
      labels,
      page,
      per_page,
    });

    return NextResponse.json({
      success: true,
      issues,
      pagination: {
        page,
        per_page,
        count: issues.length,
      },
    });
  } catch (error) {
    console.error("버그 이슈 조회 실패:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "버그 이슈 조회에 실패했습니다",
      },
      { status: 500 },
    );
  }
}

// GitHub 연결 상태 확인
export async function HEAD() {
  try {
    const status = await checkGitHubConnection();
    if (status.connected) {
      return new NextResponse(null, { status: 200 });
    }
    return new NextResponse(null, { status: 503 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
