/**
 * 게시글 Repository
 * Development Philosophy - Repository Layer (2️⃣)
 *
 * 책임:
 * - 서버사이드 데이터 접근 (createServerSupabaseClient 사용)
 * - Supabase 쿼리 실행 및 복잡한 데이터 로직
 * - 트랜잭션 처리
 * - 데이터 변환 및 검증
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type {
  Post,
  PostDetail,
  GetPostsParams,
  GetPostsResponse,
  PostSortBy,
} from "@/models/posts.types";

/**
 * 정렬 옵션에 따른 Supabase 정렬 컬럼 매핑
 */
const SORT_COLUMN_MAP: Record<PostSortBy, { column: string; ascending: boolean }> = {
  latest: { column: "created_at", ascending: false },
  popular: { column: "like_count", ascending: false },
  comments: { column: "comment_count", ascending: false },
  views: { column: "view_count", ascending: false },
};

/**
 * 게시글 Repository 클래스
 * 서버사이드 전용 - API Routes에서만 호출
 */
export class PostsRepository {
  /**
   * 게시글 목록 조회
   * @param params 조회 파라미터
   * @returns 게시글 목록 및 페이지네이션 정보
   * @throws Supabase 쿼리 실패 시 에러
   */
  async getPosts(params: GetPostsParams = {}): Promise<GetPostsResponse> {
    const {
      boardId,
      search,
      sortBy = "latest",
      page = 1,
      limit = 20,
      includeNotice = true,
    } = params;

    const supabase = await createServerSupabaseClient();
    const offset = (page - 1) * limit;

    // Base query
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        board_id,
        title,
        content,
        writer_id,
        writer_name,
        thumbnail,
        view_count,
        comment_count,
        like_count,
        dislike_count,
        is_notice,
        is_secret,
        is_anonymous,
        status,
        created_at,
        updated_at,
        boards!inner(name)
      `,
        { count: "exact" },
      )
      .eq("status", "published")
      .is("deleted_at", null);

    // 게시판 필터
    if (boardId) {
      query = query.eq("board_id", boardId);
    }

    // 공지사항 제외
    if (!includeNotice) {
      query = query.eq("is_notice", false);
    }

    // 검색
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 정렬
    const sortConfig = SORT_COLUMN_MAP[sortBy];
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    // 공지사항 우선 정렬
    if (includeNotice) {
      query = query.order("is_notice", { ascending: false });
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[PostsRepository] Failed to fetch posts:", error);
      throw new Error(`게시글 목록 조회 실패: ${error.message}`);
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / limit);

    // Transform data to include board_name
    const posts: Post[] =
      data?.map((post) => {
        const { boards, ...postData } = post as Record<string, unknown>;
        return {
          ...(postData as Omit<Post, "board_name">),
          board_name: (boards as { name: string })?.name,
        };
      }) ?? [];

    return {
      posts,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * 게시글 상세 조회 (조회수 증가 포함)
   * Core-Supabase posts_read RPC 함수 사용
   * @param id 게시글 ID
   * @param viewerIp 조회자 IP (조회수 증가용)
   * @returns 게시글 상세 정보
   * @throws Supabase 쿼리 실패 시 에러
   */
  async getPostById(id: number, viewerIp?: string): Promise<PostDetail | null> {
    const supabase = await createServerSupabaseClient();

    // Core-Supabase posts_read RPC 함수 호출
    // 이 함수는 권한 체크, 조회수 증가, 포인트 차감을 모두 처리함
    const { data, error } = await supabase.rpc("posts_read", {
      p_post_id: id,
      p_viewer_ip: viewerIp ?? "127.0.0.1",
    });

    if (error) {
      console.error("[PostsRepository] Failed to fetch post:", error);
      throw new Error(`게시글 조회 실패: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // RPC 함수는 jsonb를 반환하므로 타입 변환
    return data as unknown as PostDetail;
  }

  /**
   * 게시판별 게시글 개수 조회
   * @param boardId 게시판 ID
   * @returns 게시글 개수
   */
  async getPostCountByBoard(boardId: number): Promise<number> {
    const supabase = await createServerSupabaseClient();

    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("board_id", boardId)
      .eq("status", "published")
      .is("deleted_at", null);

    if (error) {
      console.error("[PostsRepository] Failed to get post count:", error);
      return 0;
    }

    return count ?? 0;
  }

  /**
   * 게시글 생성
   * Core-Supabase posts_create RPC 함수 사용
   * @param post 게시글 데이터
   * @returns 생성된 게시글 ID
   * @throws Supabase 쿼리 실패 시 에러
   */
  async createPost(post: Partial<Post>): Promise<{ id: number }> {
    const supabase = await createServerSupabaseClient();

    // Core-Supabase posts_create RPC 함수 호출
    const { data: postId, error } = await supabase.rpc("posts_create", {
      p_board_id: post.board_id!,
      p_title: post.title!,
      p_content: post.content!,
      p_category_id: post.category_id ?? (null as unknown as undefined),
      p_parent_id: null as unknown as undefined,
      p_attachments: null as unknown as undefined,
      p_metadata: null as unknown as undefined,
      p_restrict_attachments: [] as unknown as undefined,
      p_password: null as unknown as undefined,
      p_is_notice: false,
      p_is_secret: post.is_secret ?? false,
      p_is_anonymous: post.is_anonymous ?? false,
      p_anonymous_nickname: null as unknown as undefined,
      p_download_point: null as unknown as undefined,
    });

    if (error) {
      console.error("[PostsRepository] Failed to create post:", error);
      throw new Error(`게시글 생성 실패: ${error.message}`);
    }

    if (!postId) {
      throw new Error("게시글 생성 실패: ID가 반환되지 않았습니다.");
    }

    return { id: postId as number };
  }

  /**
   * 게시글 수정
   * @param id 게시글 ID
   * @param post 수정할 데이터
   * @returns 수정된 게시글
   * @throws Supabase 쿼리 실패 시 에러
   */
  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // 수정 가능한 필드만 포함
    if (post.title !== undefined) updateData.title = post.title;
    if (post.content !== undefined) updateData.content = post.content;
    if (post.category_id !== undefined) updateData.category_id = post.category_id;
    if (post.thumbnail !== undefined) updateData.thumbnail = post.thumbnail;
    if (post.is_secret !== undefined) updateData.is_secret = post.is_secret;
    if (post.updated_by !== undefined) updateData.updated_by = post.updated_by;

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        boards!inner(name)
      `,
      )
      .single();

    if (error) {
      console.error("[PostsRepository] Failed to update post:", error);
      throw new Error(`게시글 수정 실패: ${error.message}`);
    }

    if (!data) {
      throw new Error("게시글 수정 실패: 데이터가 반환되지 않았습니다.");
    }

    // Transform data
    const { boards, ...postData } = data as Record<string, unknown>;
    return {
      ...(postData as Omit<Post, "board_name">),
      board_name: (boards as { name: string })?.name,
    };
  }

  /**
   * 게시글 삭제 (소프트 삭제)
   * Core-Supabase posts_delete RPC 함수 사용
   * @param id 게시글 ID
   * @throws Supabase 쿼리 실패 시 에러
   */
  async deletePost(id: number): Promise<void> {
    const supabase = await createServerSupabaseClient();

    // Core-Supabase posts_delete RPC 함수 호출
    const { error } = await supabase.rpc("posts_delete", {
      p_post_id: id,
    });

    if (error) {
      console.error("[PostsRepository] Failed to delete post:", error);
      throw new Error(`게시글 삭제 실패: ${error.message}`);
    }
  }
}
