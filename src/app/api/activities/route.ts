/**
 * Activities API Route
 * Development Philosophy - API Routes Layer (1️⃣)
 *
 * 책임:
 * - HTTP 요청 핸들러 (Controller 역할)
 * - Repository 메서드 호출
 * - 요청 파라미터 검증 및 파싱
 * - 에러 응답 포맷팅
 */

import { NextRequest, NextResponse } from 'next/server';

import { ActivityRepository } from '@/app/dashboard/_repositories';

import type { GetActivitiesParams } from '@/models/activity.types';


/**
 * GET /api/activities - 사용자 활동 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const params: GetActivitiesParams = {
      userId,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 5,
    };

    // Repository 호출
    const repository = new ActivityRepository();
    const response = await repository.getActivities(params);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[API /api/activities] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch activities',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
