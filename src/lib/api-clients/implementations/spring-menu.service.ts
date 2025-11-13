/**
 * Spring Boot Menu 서비스 구현체
 * Production 환경에서 Spring Boot API 직접 호출 (1-Hop)
 */

import type { MenuItem, GetMenusParams } from "@/models/menu.types";
import type { IMenuService } from "../interfaces/menu.interface";

export class SpringMenuService implements IMenuService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080";
  }

  /**
   * 메뉴 목록 조회
   * Spring Boot API 직접 호출 (1-Hop)
   */
  async getMenus(params: GetMenusParams = {}): Promise<MenuItem[]> {
    const queryParams = new URLSearchParams();

    if (params.device) {
      queryParams.append("device", params.device);
    }
    if (params.userLevel !== undefined) {
      queryParams.append("userLevel", params.userLevel.toString());
    }

    const url = `${this.baseURL}/api/menu${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    } as RequestInit);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch menu data from Spring Boot");
    }

    const data = await response.json();
    return data.menus || [];
  }
}
