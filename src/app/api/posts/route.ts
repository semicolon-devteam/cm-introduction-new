/**
 * Posts API Route
 * Development Philosophy - API Routes Layer (1️⃣)
 *
 * 책임:
 * - HTTP 요청 핸들러 (Controller 역할)
 * - Repository 메서드 호출
 * - 요청 파라미터 검증 및 파싱
 * - 에러 응답 포맷팅
 */

import { NextRequest, NextResponse } from "next/server";

import { PostsRepository } from "@/app/posts/_repositories";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { GetPostsParams, CreatePostRequest } from "@/models/posts.types";

/**
 * GET /api/posts - 게시글 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const params: GetPostsParams = {
      boardId: searchParams.get("boardId") ? Number(searchParams.get("boardId")) : undefined,
      search: searchParams.get("search") ?? undefined,
      sortBy: (searchParams.get("sortBy") as GetPostsParams["sortBy"]) ?? "latest",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
      includeNotice: searchParams.get("includeNotice") !== "false",
    };

    // Repository 호출
    const repository = new PostsRepository();
    const response = await repository.getPosts(params);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[API /api/posts] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/posts - 게시글 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 요청 본문 파싱
    const body: CreatePostRequest = await request.json();

    // 필수 필드 검증
    if (!body.board_id || !body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: board_id, title, content" },
        { status: 400 },
      );
    }

    // Repository 호출 (RPC 함수 사용)
    const repository = new PostsRepository();
    const result = await repository.createPost({
      ...body,
    });

    // 생성된 게시글 ID 반환
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API POST /api/posts] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
