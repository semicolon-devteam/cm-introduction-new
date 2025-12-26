/**
 * Next.js API Route를 통한 PartTimers API Client 구현
 */

import type { PartTimersApiClient } from "../interfaces";
import type {
  PartTimer,
  GetPartTimersParams,
} from "@/app/part-timers/_repositories";

export class NextPartTimersService implements PartTimersApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  }

  async getPartTimers(params: GetPartTimersParams = {}): Promise<{
    partTimers: PartTimer[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();

    if (params.includeInactive) {
      searchParams.set("includeInactive", "true");
    }

    const queryString = searchParams.toString();
    const url = `${this.baseUrl}/part-timers${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch part-timers: ${response.statusText}`);
    }

    return response.json();
  }
}
