import { NextResponse } from "next/server";
import { searchOrgOpenIssues, checkProjectConnection } from "@/lib/github";

// 캐시 설정 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData {
  timestamp: number;
  issues: ReturnType<typeof mapSearchResults>;
  projectStatus: Awaited<ReturnType<typeof checkProjectConnection>>;
}

let cache: CachedData | null = null;

// 대시보드 통합 데이터 API (REST Search API 사용 - 빠름)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    // 캐시 확인 (5분 이내면 캐시 사용)
    const now = Date.now();
    if (!forceRefresh && cache && now - cache.timestamp < CACHE_DURATION) {
      const cacheAge = Math.round((now - cache.timestamp) / 1000);
      console.log(`캐시된 데이터 사용 (${cacheAge}초 전, ${cache.issues.length}개 이슈)`);

      return NextResponse.json({
        success: true,
        data: {
          github: {
            connected: cache.projectStatus.connected,
            projectTitle: cache.projectStatus.projectTitle,
            itemCount: cache.issues.length,
            issues: cache.issues,
          },
          cached: true,
          cacheAge,
          timestamp: new Date().toISOString(),
        },
      });
    }

    console.log("GitHub REST Search API 호출 시작...");
    const startTime = Date.now();

    // GitHub Project 연결 상태 확인 (빠름)
    const projectStatus = await checkProjectConnection();

    // 조직의 열린 이슈만 빠르게 검색 (REST API)
    const org = process.env.GITHUB_ORG || "semicolon-devteam";
    const searchResults = await searchOrgOpenIssues(org);

    const elapsed = Date.now() - startTime;
    console.log(`GitHub REST Search 완료 (${elapsed}ms, ${searchResults.length}개 열린 이슈)`);

    // 검색 결과를 대시보드 형식으로 변환
    const issues = mapSearchResults(searchResults);

    // 캐시 저장
    cache = {
      timestamp: now,
      issues,
      projectStatus,
    };

    return NextResponse.json({
      success: true,
      data: {
        github: {
          connected: projectStatus.connected,
          projectTitle: projectStatus.projectTitle,
          itemCount: issues.length,
          issues,
        },
        cached: false,
        fetchTime: elapsed,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("대시보드 데이터 조회 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "대시보드 데이터 조회에 실패했습니다",
      },
      { status: 500 }
    );
  }
}

// REST Search 결과를 대시보드 형식으로 변환
function mapSearchResults(items: Awaited<ReturnType<typeof searchOrgOpenIssues>>) {
  return items.map((item) => {
    // repository_url에서 레포명 추출: https://api.github.com/repos/org/repo
    const repoMatch = item.repository_url?.match(/\/repos\/[^/]+\/([^/]+)$/);
    const repository = repoMatch ? repoMatch[1] : null;

    return {
      id: String(item.id),
      number: item.number,
      title: item.title,
      state: item.state,
      html_url: item.html_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      status: null, // REST API에는 Project status가 없음
      priority: null,
      repository,
      type: "ISSUE" as const,
      assignees: item.assignees?.map((a) => a.login) || [],
      labels: item.labels?.map((label) => ({
        id: label.name,
        name: label.name,
        color: label.color,
      })) || [],
    };
  });
}
