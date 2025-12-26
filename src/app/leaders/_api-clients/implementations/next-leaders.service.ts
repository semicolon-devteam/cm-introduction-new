/**
 * Next.js API 기반 Leaders Service 구현
 */

import type { Leader, GetLeadersParams, GetLeadersResponse } from "@/models/leader.types";

import type { ILeadersService } from "../interfaces";

export class NextLeadersService implements ILeadersService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  async getLeaders(params: GetLeadersParams = {}): Promise<GetLeadersResponse> {
    const searchParams = new URLSearchParams();

    if (params.includeInactive) {
      searchParams.set("includeInactive", "true");
    }

    const queryString = searchParams.toString();
    const url = `${this.baseUrl}/leaders${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaders: ${response.statusText}`);
    }

    return response.json();
  }

  async getLeaderBySlug(slug: string): Promise<Leader | null> {
    const response = await fetch(`${this.baseUrl}/leaders/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch leader: ${response.statusText}`);
    }

    const data = await response.json();
    return data.leader;
  }
}
