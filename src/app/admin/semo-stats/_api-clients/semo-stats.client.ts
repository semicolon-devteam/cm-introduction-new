/**
 * SEMO Stats Client Factory
 *
 * Factory Pattern으로 환경에 따른 서비스 구현 선택
 */

import { NextSemoStatsService } from "./implementations/next-semo-stats.service";

import type { ISemoStatsService } from "./interfaces/semo-stats.interface";

function createSemoStatsClient(): ISemoStatsService {
  // 현재는 Next.js API만 지원
  // 추후 Spring Boot API 지원 시 환경변수로 분기
  return new NextSemoStatsService();
}

export const semoStatsClient = createSemoStatsClient();
