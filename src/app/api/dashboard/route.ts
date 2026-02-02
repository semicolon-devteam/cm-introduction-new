import { NextResponse } from "next/server";

import { checkProjectConnection, getProjectItems } from "@/lib/github";

export async function GET() {
  try {
    // GitHub Project 연결 상태 확인
    const connectionStatus = await checkProjectConnection();

    // 연결되어 있으면 이슈 목록도 가져오기
    let issues: Array<{
      id: string;
      title: string;
      number: number | null;
      state: string | null;
      labels: Array<{ name: string; color: string }>;
    }> = [];

    if (connectionStatus.connected) {
      try {
        const items = await getProjectItems();
        issues = items
          .filter((item) => item.type === "ISSUE")
          .map((item) => ({
            id: item.id,
            title: item.title,
            number: item.number,
            state: item.state,
            labels: item.labels,
          }));
      } catch {
        // 이슈 로드 실패해도 연결 상태는 유지
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        github: {
          connected: connectionStatus.connected,
          projectTitle: connectionStatus.projectTitle,
          itemCount: connectionStatus.itemCount,
          error: connectionStatus.error,
          issues,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "서버 오류",
      data: {
        github: {
          connected: false,
          issues: [],
        },
      },
    });
  }
}
