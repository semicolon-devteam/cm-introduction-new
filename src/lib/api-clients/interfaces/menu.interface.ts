/**
 * 메뉴 API 인터페이스
 * Spring Boot / Next.js 구현체가 모두 준수해야 함
 */

import type { MenuItem, GetMenusParams } from "@/models/menu.types";

/**
 * Menu Service Interface
 */
export interface IMenuService {
  /**
   * 메뉴 목록 조회 (계층 구조)
   * @param params - 조회 파라미터 (device, userLevel)
   * @returns 계층 구조의 메뉴 목록
   */
  getMenus(params?: GetMenusParams): Promise<MenuItem[]>;
}
