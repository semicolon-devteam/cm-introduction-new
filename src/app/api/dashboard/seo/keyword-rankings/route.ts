import { NextRequest, NextResponse } from "next/server";

/**
 * 키워드 순위 기록 타입
 */
export interface KeywordRankingEntry {
  id: string;
  keyword: string;
  date: string; // YYYY-MM-DD
  rankings: {
    google?: number | null; // null = 100위권 밖
    naver?: number | null;
  };
  source: "manual" | "search_console" | "auto";
  notes?: string;
}

/**
 * 키워드 순위 히스토리 (프로젝트별)
 */
export interface KeywordRankingHistory {
  projectId: string;
  keyword: string;
  history: KeywordRankingEntry[];
  lastUpdated: string;
}

export interface KeywordRankingsResponse {
  success: boolean;
  projectId: string;
  rankings: KeywordRankingHistory[];
  summary?: {
    trackedKeywords: number;
    avgGoogleRank: number | null;
    avgNaverRank: number | null;
    improvedKeywords: number;
    declinedKeywords: number;
  };
  error?: string;
}

/**
 * GET /api/dashboard/seo/keyword-rankings?projectId=xxx
 * 프로젝트의 키워드 순위 히스토리 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId가 필요합니다." },
        { status: 400 },
      );
    }

    // 클라이언트 사이드 LocalStorage에서 관리하므로
    // 서버에서는 현재 주 정보와 기본 구조만 반환
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Search Console에서 평균 순위 데이터 가져오기 시도
    let searchConsoleRankings: { keyword: string; position: number }[] = [];
    try {
      // 내부 API 호출
      const scResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3004"}/api/dashboard/search-console?period=7days`,
        { cache: "no-store" },
      );

      if (scResponse.ok) {
        const scData = await scResponse.json();
        if (scData.topQueries) {
          searchConsoleRankings = scData.topQueries
            .slice(0, 20)
            .map((q: { query: string; position: number }) => ({
              keyword: q.query,
              position: Math.round(q.position * 10) / 10,
            }));
        }
      }
    } catch (e) {
      console.error("Search Console data fetch failed:", e);
    }

    const response: KeywordRankingsResponse = {
      success: true,
      projectId,
      rankings: [],
      summary: {
        trackedKeywords: searchConsoleRankings.length,
        avgGoogleRank:
          searchConsoleRankings.length > 0
            ? Math.round(
                (searchConsoleRankings.reduce((sum, r) => sum + r.position, 0) /
                  searchConsoleRankings.length) *
                  10,
              ) / 10
            : null,
        avgNaverRank: null,
        improvedKeywords: 0,
        declinedKeywords: 0,
      },
    };

    // Search Console에서 가져온 데이터로 기본 순위 히스토리 생성
    if (searchConsoleRankings.length > 0) {
      response.rankings = searchConsoleRankings.map((r) => ({
        projectId,
        keyword: r.keyword,
        history: [
          {
            id: `${Date.now()}-${r.keyword}`,
            keyword: r.keyword,
            date: today,
            rankings: {
              google: r.position,
              naver: null,
            },
            source: "search_console" as const,
          },
        ],
        lastUpdated: today,
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Keyword rankings API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "순위 조회 실패",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/dashboard/seo/keyword-rankings
 * 수동 순위 입력 저장
 *
 * Body: {
 *   projectId: string;
 *   entries: KeywordRankingEntry[];
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, entries } = body as {
      projectId: string;
      entries: Omit<KeywordRankingEntry, "id">[];
    };

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId가 필요합니다." },
        { status: 400 },
      );
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { success: false, error: "순위 데이터가 필요합니다." },
        { status: 400 },
      );
    }

    // 서버에서는 저장하지 않고, 클라이언트에서 LocalStorage로 관리
    // 여기서는 입력 데이터 검증 및 ID 생성만 수행
    const processedEntries: KeywordRankingEntry[] = entries.map((entry, idx) => ({
      ...entry,
      id: `manual-${Date.now()}-${idx}`,
      source: "manual" as const,
    }));

    return NextResponse.json({
      success: true,
      message: `${processedEntries.length}개의 순위 데이터가 처리되었습니다.`,
      entries: processedEntries,
    });
  } catch (error) {
    console.error("Keyword rankings save error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "순위 저장 실패",
      },
      { status: 500 },
    );
  }
}
