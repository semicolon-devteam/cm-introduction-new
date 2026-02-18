/**
 * PartTimers API Client Interface
 */

import type {
  PartTimer,
  GetPartTimersParams,
} from "@/app/part-timers/_repositories";

export interface PartTimersApiClient {
  getPartTimers(params?: GetPartTimersParams): Promise<{
    partTimers: PartTimer[];
    total: number;
  }>;
}
