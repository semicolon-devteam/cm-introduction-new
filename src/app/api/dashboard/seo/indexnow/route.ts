import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_ENDPOINTS = {
  naver: "https://searchadvisor.naver.com/indexnow",
  bing: "https://www.bing.com/indexnow",
  yandex: "https://yandex.com/indexnow",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      urls,
      host,
      searchEngines = ["naver", "bing"],
    } = body as {
      urls: string[];
      host: string;
      searchEngines?: ("naver" | "bing" | "yandex")[];
    };

    const indexNowKey = process.env.INDEXNOW_KEY;

    if (!indexNowKey) {
      return NextResponse.json(
        { success: false, error: "INDEXNOW_KEY가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "URL 목록이 필요합니다." },
        { status: 400 },
      );
    }

    if (!host) {
      return NextResponse.json(
        { success: false, error: "호스트 도메인이 필요합니다." },
        { status: 400 },
      );
    }

    // IndexNow 요청 페이로드
    const payload = {
      host,
      key: indexNowKey,
      keyLocation: `https://${host}/${indexNowKey}.txt`,
      urlList: urls,
    };

    const results: {
      engine: string;
      success: boolean;
      status?: number;
      error?: string;
    }[] = [];

    // 각 검색엔진에 제출
    for (const engine of searchEngines) {
      const endpoint = INDEXNOW_ENDPOINTS[engine];
      if (!endpoint) continue;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        results.push({
          engine,
          success: response.ok || response.status === 202,
          status: response.status,
        });
      } catch (error) {
        results.push({
          engine,
          success: false,
          error: error instanceof Error ? error.message : "요청 실패",
        });
      }
    }

    const allSuccess = results.every((r) => r.success);
    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successCount}/${results.length} 검색엔진에 색인 요청 완료`,
      results,
      urlCount: urls.length,
    });
  } catch (error) {
    console.error("IndexNow error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "IndexNow 제출 실패",
      },
      { status: 500 },
    );
  }
}

// GET: IndexNow 상태 확인
export async function GET() {
  const indexNowKey = process.env.INDEXNOW_KEY;

  return NextResponse.json({
    configured: !!indexNowKey,
    keyLength: indexNowKey?.length || 0,
    endpoints: Object.keys(INDEXNOW_ENDPOINTS),
  });
}
