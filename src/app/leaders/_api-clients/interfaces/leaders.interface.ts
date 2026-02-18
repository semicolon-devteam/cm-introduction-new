/**
 * Leaders API Client Interface
 */

import type { Leader, GetLeadersParams, GetLeadersResponse } from "@/models/leader.types";

export interface ILeadersService {
  getLeaders(params?: GetLeadersParams): Promise<GetLeadersResponse>;
  getLeaderBySlug(slug: string): Promise<Leader | null>;
}
