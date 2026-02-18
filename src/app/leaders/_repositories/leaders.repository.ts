/**
 * Leaders Repository
 *
 * Supabase를 통한 리더 데이터 접근
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Database } from "@/lib/supabase/database.types";
import type {
  Leader,
  GetLeadersParams,
  GetLeadersResponse,
  CreateLeaderParams,
  UpdateLeaderParams,
} from "@/models/leader.types";

export type {
  Leader,
  GetLeadersParams,
  GetLeadersResponse,
  CreateLeaderParams,
  UpdateLeaderParams,
} from "@/models/leader.types";

type LeaderRow = Database["public"]["Tables"]["leaders"]["Row"];

function mapRowToLeader(row: LeaderRow): Leader {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nickname: row.nickname,
    position: row.position,
    summary: row.summary,
    career: row.career ?? [],
    profileImage: row.profile_image,
    message: row.message,
    skills: row.skills ?? [],
    socialLinks: row.social_links ?? {},
    isActive: row.is_active ?? true,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

export class LeadersRepository {
  /**
   * 리더 목록 조회
   */
  async getLeaders(
    params: GetLeadersParams = {}
  ): Promise<GetLeadersResponse> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("leaders")
      .select("*")
      .order("display_order", { ascending: true });

    if (!params.includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch leaders: ${error.message}`);
    }

    const leaders = ((data ?? []) as LeaderRow[]).map(mapRowToLeader);

    return {
      leaders,
      total: leaders.length,
    };
  }

  /**
   * 단일 리더 조회 (ID)
   */
  async getLeaderById(id: number): Promise<Leader | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch leader: ${error.message}`);
    }

    return mapRowToLeader(data as LeaderRow);
  }

  /**
   * 단일 리더 조회 (Slug)
   */
  async getLeaderBySlug(slug: string): Promise<Leader | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch leader: ${error.message}`);
    }

    return mapRowToLeader(data as LeaderRow);
  }

  /**
   * 리더 생성
   */
  async createLeader(params: CreateLeaderParams): Promise<Leader> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("leaders")
      .insert({
        slug: params.slug,
        name: params.name,
        nickname: params.nickname ?? null,
        position: params.position,
        summary: params.summary ?? null,
        career: params.career ?? [],
        profile_image: params.profileImage ?? null,
        message: params.message ?? null,
        skills: params.skills ?? [],
        social_links: params.socialLinks ?? {},
        is_active: params.isActive ?? true,
        display_order: params.displayOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create leader: ${error.message}`);
    }

    return mapRowToLeader(data as LeaderRow);
  }

  /**
   * 리더 수정
   */
  async updateLeader(id: number, params: UpdateLeaderParams): Promise<Leader> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (params.slug !== undefined) updateData.slug = params.slug;
    if (params.name !== undefined) updateData.name = params.name;
    if (params.nickname !== undefined) updateData.nickname = params.nickname;
    if (params.position !== undefined) updateData.position = params.position;
    if (params.summary !== undefined) updateData.summary = params.summary;
    if (params.career !== undefined) updateData.career = params.career;
    if (params.profileImage !== undefined) updateData.profile_image = params.profileImage;
    if (params.message !== undefined) updateData.message = params.message;
    if (params.skills !== undefined) updateData.skills = params.skills;
    if (params.socialLinks !== undefined) updateData.social_links = params.socialLinks;
    if (params.isActive !== undefined) updateData.is_active = params.isActive;
    if (params.displayOrder !== undefined) updateData.display_order = params.displayOrder;

    const { data, error } = await supabase
      .from("leaders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update leader: ${error.message}`);
    }

    return mapRowToLeader(data as LeaderRow);
  }

  /**
   * 리더 삭제 (하드 삭제)
   */
  async deleteLeader(id: number): Promise<void> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("leaders").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete leader: ${error.message}`);
    }
  }

  /**
   * 리더 활성화/비활성화 토글
   */
  async toggleLeaderActive(id: number): Promise<Leader> {
    const leader = await this.getLeaderById(id);
    if (!leader) {
      throw new Error("Leader not found");
    }

    return this.updateLeader(id, { isActive: !leader.isActive });
  }
}
