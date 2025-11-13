/**
 * 메뉴 Repository
 * Development Philosophy - Repository Layer (2️⃣)
 *
 * 책임:
 * - 서버사이드 데이터 접근 (createServerSupabaseClient 사용)
 * - 메뉴 목록 조회 및 계층 구조 변환
 * - 사용자 레벨 기반 필터링
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Menu, MenuItem, GetMenusParams } from "@/models/menu.types";

/**
 * 메뉴 Repository 클래스
 * 서버사이드 전용 - API Routes에서만 호출
 */
export class MenuRepository {
  /**
   * 메뉴 목록 조회 (계층 구조)
   * @param params - 조회 파라미터 (device, userLevel)
   * @returns 계층 구조의 메뉴 목록
   */
  async getMenus(params: GetMenusParams = {}): Promise<MenuItem[]> {
    const supabase = await createServerSupabaseClient();
    const { device, userLevel = 1 } = params;

    // 1. 모든 메뉴 조회
    let query = supabase
      .from("menu")
      .select("*")
      .is("deleted_at", null)
      .lte("required_level", userLevel)
      .order("parent_id", { ascending: true, nullsFirst: true })
      .order("display_order", { ascending: true });

    // 2. 디바이스 필터링
    if (device === "pc") {
      query = query.eq("is_pc_enabled", true);
    } else if (device === "mobile") {
      query = query.eq("is_mobile_enabled", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[MenuRepository] Failed to fetch menus:", error);
      return [];
    }

    if (!data) {
      return [];
    }

    // 3. 계층 구조로 변환
    return this.buildMenuTree(data as Menu[]);
  }

  /**
   * Flat 메뉴 목록을 계층 구조로 변환
   * @param menus - Flat 메뉴 목록
   * @returns 계층 구조의 메뉴 목록
   */
  private buildMenuTree(menus: Menu[]): MenuItem[] {
    const menuMap = new Map<number, MenuItem>();
    const rootMenus: MenuItem[] = [];

    // 1. 모든 메뉴를 Map으로 변환
    menus.forEach((menu) => {
      menuMap.set(menu.id, {
        id: menu.id,
        name: menu.name,
        type: menu.type,
        board_id: menu.board_id,
        link_url: menu.link_url,
        required_level: menu.required_level,
        children: [],
      });
    });

    // 2. 부모-자식 관계 설정
    menus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id);
      if (!menuItem) return;

      if (menu.parent_id === null) {
        // 최상위 메뉴
        rootMenus.push(menuItem);
      } else {
        // 하위 메뉴
        const parent = menuMap.get(menu.parent_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(menuItem);
        }
      }
    });

    return rootMenus;
  }
}
