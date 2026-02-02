import { NextResponse } from "next/server";

/**
 * Naver IndexNow API
 *
 * 네이버에 URL 색인 요청을 전송하는 API
 * IndexNow 프로토콜 사용: https://www.indexnow.org/documentation
 *
 * 환경 변수:
 * - INDEXNOW_KEY: IndexNow API 키 (8-128자, 16진수 + 대시)
 *
 * 사용 전 준비:
 * 1. 키 생성 (예: "abc123def456")
 * 2. 웹사이트 루트에 {key}.txt 파일 배치 (예: https://example.com/abc123def456.txt)
 * 3. 해당 파일에 키 값만 저장
 */

const NAVER_INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";

interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

interface IndexNowResponse {
  success: boolean;
  submitted: number;
  message: string;
  details?: {
    statusCode: number;
    statusText: string;
  };
}

// POST: URL 제출
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urls, host, key, keyLocation } = body as {
      urls: string[];
      host: string;
      key?: string;
      keyLocation?: string;
    };

    // 키 확인 (요청에서 받거나 환경 변수에서)
    const indexNowKey = key || process.env.INDEXNOW_KEY;

    if (!indexNowKey) {
      return NextResponse.json({
        success: false,
        submitted: 0,
        message: "IndexNow 키가 설정되지 않았습니다. 환경 변수 INDEXNOW_KEY를 설정하세요.",
      } as IndexNowResponse);
    }

    if (!urls || urls.length === 0) {
      return NextResponse.json({
        success: false,
        submitted: 0,
        message: "제출할 URL이 없습니다.",
      } as IndexNowResponse);
    }

    if (!host) {
      return NextResponse.json({
        success: false,
        submitted: 0,
        message: "호스트가 지정되지 않았습니다.",
      } as IndexNowResponse);
    }

    // URL 개수 제한 (최대 10,000개)
    const limitedUrls = urls.slice(0, 10000);

    // IndexNow 요청 본문
    const indexNowBody: IndexNowRequest = {
      host,
      key: indexNowKey,
      urlList: limitedUrls,
    };

    if (keyLocation) {
      indexNowBody.keyLocation = keyLocation;
    }

    // Naver IndexNow API 호출
    const response = await fetch(NAVER_INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(indexNowBody),
    });

    // 응답 처리
    if (response.ok || response.status === 202) {
      return NextResponse.json({
        success: true,
        submitted: limitedUrls.length,
        message: `${limitedUrls.length}개 URL이 네이버에 제출되었습니다.`,
        details: {
          statusCode: response.status,
          statusText: response.statusText,
        },
      } as IndexNowResponse);
    }

    // 에러 응답
    const errorMessages: Record<number, string> = {
      400: "잘못된 요청 형식입니다.",
      403: "IndexNow 키가 유효하지 않습니다. 키 파일이 올바르게 배치되었는지 확인하세요.",
      422: "요청 URL이 유효하지 않습니다.",
      429: "요청 빈도가 초과되었습니다. 잠시 후 다시 시도하세요.",
    };

    return NextResponse.json({
      success: false,
      submitted: 0,
      message: errorMessages[response.status] || `네이버 API 오류: ${response.status}`,
      details: {
        statusCode: response.status,
        statusText: response.statusText,
      },
    } as IndexNowResponse);
  } catch (error) {
    console.error("IndexNow API Error:", error);
    return NextResponse.json({
      success: false,
      submitted: 0,
      message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    } as IndexNowResponse);
  }
}

// GET: 상태 확인 및 키 생성 가이드
export async function GET() {
  const indexNowKey = process.env.INDEXNOW_KEY;

  return NextResponse.json({
    configured: !!indexNowKey,
    keyConfigured: !!indexNowKey,
    endpoint: NAVER_INDEXNOW_ENDPOINT,
    guide: {
      step1: "IndexNow 키 생성 (8-128자, a-z, A-Z, 0-9, - 만 사용)",
      step2: "환경 변수 INDEXNOW_KEY에 키 저장",
      step3: "웹사이트 루트에 {key}.txt 파일 생성 (예: https://example.com/abc123.txt)",
      step4: "파일 내용에 키 값만 저장",
      step5: "이 API를 통해 URL 제출",
    },
    limits: {
      maxUrlsPerRequest: 10000,
      keyLength: "8-128자",
      allowedChars: "a-z, A-Z, 0-9, -",
    },
  });
}
