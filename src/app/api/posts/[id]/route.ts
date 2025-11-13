/**
 * Posts Detail API Route
 * Development Philosophy - API Routes Layer (1️⃣)
 */

import { NextRequest, NextResponse } from "next/server";

import { PostsRepository } from "@/app/posts/_repositories";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { UpdatePostRequest } from "@/models/posts.types";

/**
 * GET /api/posts/[id] - 게시글 상세 조회
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const repository = new PostsRepository();

    // posts_read RPC 함수가 조회수 증가를 자동으로 처리함
    // 클라이언트 IP 추출
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "127.0.0.1";

    const post = await repository.getPostById(postId, clientIp);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("[API /api/posts/[id]] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/posts/[id] - 게시글 수정
 */
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // 인증 확인
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 기존 게시글 조회 (권한 확인)
    const repository = new PostsRepository();
    const existingPost = await repository.getPostById(postId);

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 작성자 확인
    // Note: writer_id는 bigint이므로 문자열 비교가 필요할 수 있음
    if (existingPost.writer_id && String(existingPost.writer_id) !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You are not the author of this post" },
        { status: 403 },
      );
    }

    // 요청 본문 파싱
    const body: Partial<UpdatePostRequest> = await request.json();

    // 게시글 수정
    const updatedPost = await repository.updatePost(postId, {
      ...body,
      // Note: updated_by는 사용하지 않음 (RPC 함수에서 자동 처리 예상)
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("[API PATCH /api/posts/[id]] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to update post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/posts/[id] - 게시글 삭제 (소프트 삭제)
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // 인증 확인
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 기존 게시글 조회 (권한 확인)
    const repository = new PostsRepository();
    const existingPost = await repository.getPostById(postId);

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 작성자 확인
    // Note: writer_id는 bigint이므로 문자열 비교가 필요할 수 있음
    if (existingPost.writer_id && String(existingPost.writer_id) !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You are not the author of this post" },
        { status: 403 },
      );
    }

    // 게시글 삭제
    await repository.deletePost(postId);

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[API DELETE /api/posts/[id]] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
