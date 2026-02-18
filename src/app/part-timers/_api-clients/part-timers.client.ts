/**
 * PartTimers API Client Factory
 *
 * 환경에 따라 적절한 API Client 구현체를 반환
 */

import type { PartTimersApiClient } from "./interfaces";
import { NextPartTimersService } from "./implementations";

function createPartTimersClient(): PartTimersApiClient {
  // 현재는 Next.js API Route만 지원
  // 추후 Spring Boot API 등 다른 백엔드 추가 가능
  return new NextPartTimersService();
}

export const partTimersClient = createPartTimersClient();
