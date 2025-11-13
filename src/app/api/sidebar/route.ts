/**
 * Sidebar API Route
 * Development Philosophy - API Routes Layer (1️⃣)
 */

import { NextResponse} from 'next/server';

import { SidebarRepository } from '@/repositories/sidebar.repository';

/**
 * GET /api/sidebar - 사이드바 데이터 조회
 */
export async function GET() {
  try {
    const repository = new SidebarRepository();

    // 병렬로 데이터 조회
    const [trendingTopics, communityStats] = await Promise.all([
      repository.getTrendingTopics(),
      repository.getCommunityStats(),
    ]);

    return NextResponse.json(
      {
        trendingTopics,
        communityStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/sidebar] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch sidebar data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
