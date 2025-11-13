/**
 * Next.js API Menu 서비스 구현체
 * Spring Boot가 없는 로컬 개발 환경에서 사용
 */

import type { MenuItem, GetMenusParams } from "@/models/menu.types";
import type { IMenuService } from "../interfaces/menu.interface";

export class NextMenuService implements IMenuService {
  /**
   * 메뉴 목록 조회
   * Next.js API Route 호출
   */
  async getMenus(params: GetMenusParams = {}): Promise<MenuItem[]> {
    const queryParams = new URLSearchParams();

    if (params.device) {
      queryParams.append("device", params.device);
    }
    if (params.userLevel !== undefined) {
      queryParams.append("userLevel", params.userLevel.toString());
    }

    const url = `/api/menu${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch menu data");
    }

    const data = await response.json();
    return data.menus || [];
  }
}
