/**
 * PartTimers Repository
 *
 * Supabase를 통한 파트타이머 데이터 접근
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Database } from "@/lib/supabase/database.types";

type PartTimerRow = Database["public"]["Tables"]["part_timers"]["Row"];

export interface PartTimer {
  id: number;
  nickname: string;
  role: string;
  team: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetPartTimersParams {
  includeInactive?: boolean;
}

export interface GetPartTimersResponse {
  partTimers: PartTimer[];
  total: number;
}

export interface CreatePartTimerParams {
  nickname: string;
  role: string;
  team?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdatePartTimerParams {
  nickname?: string;
  role?: string;
  team?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

function mapRowToPartTimer(row: PartTimerRow): PartTimer {
  return {
    id: row.id,
    nickname: row.nickname,
    role: row.role,
    team: row.team,
    isActive: row.is_active ?? true,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

export class PartTimersRepository {
  /**
   * 파트타이머 목록 조회
   */
  async getPartTimers(
    params: GetPartTimersParams = {}
  ): Promise<GetPartTimersResponse> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("part_timers")
      .select("*")
      .order("display_order", { ascending: true });

    if (!params.includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch part-timers: ${error.message}`);
    }

    const partTimers = ((data ?? []) as PartTimerRow[]).map(mapRowToPartTimer);

    return {
      partTimers,
      total: partTimers.length,
    };
  }

  /**
   * 단일 파트타이머 조회
   */
  async getPartTimerById(id: number): Promise<PartTimer | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("part_timers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch part-timer: ${error.message}`);
    }

    return mapRowToPartTimer(data as PartTimerRow);
  }

  /**
   * 파트타이머 생성
   */
  async createPartTimer(params: CreatePartTimerParams): Promise<PartTimer> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("part_timers")
      .insert({
        nickname: params.nickname,
        role: params.role,
        team: params.team ?? null,
        is_active: params.isActive ?? true,
        display_order: params.displayOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create part-timer: ${error.message}`);
    }

    return mapRowToPartTimer(data as PartTimerRow);
  }

  /**
   * 파트타이머 수정
   */
  async updatePartTimer(id: number, params: UpdatePartTimerParams): Promise<PartTimer> {
    const supabase = await createServerSupabaseClient();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (params.nickname !== undefined) updateData.nickname = params.nickname;
    if (params.role !== undefined) updateData.role = params.role;
    if (params.team !== undefined) updateData.team = params.team;
    if (params.isActive !== undefined) updateData.is_active = params.isActive;
    if (params.displayOrder !== undefined) updateData.display_order = params.displayOrder;

    const { data, error } = await supabase
      .from("part_timers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update part-timer: ${error.message}`);
    }

    return mapRowToPartTimer(data as PartTimerRow);
  }

  /**
   * 파트타이머 삭제
   */
  async deletePartTimer(id: number): Promise<void> {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("part_timers").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete part-timer: ${error.message}`);
    }
  }
}
