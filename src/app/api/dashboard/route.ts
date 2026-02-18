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
        // 버그 라벨이 있는 이슈만 필터링
        issues = items
          .filter((item) => {
            if (item.type !== "ISSUE") return false;
            // "bug" 또는 "Bug" 라벨이 있는지 확인
            const hasBugLabel = item.labels.some((label) => label.name.toLowerCase() === "bug");
            return hasBugLabel;
          })
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
