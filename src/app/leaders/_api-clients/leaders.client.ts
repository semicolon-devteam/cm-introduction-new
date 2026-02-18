/**
 * Leaders API Client Factory
 *
 * 환경에 따라 적절한 구현체 선택
 */

import { NextLeadersService } from "./implementations";

import type { ILeadersService } from "./interfaces";

function createLeadersClient(): ILeadersService {
  const apiMode = process.env.NEXT_PUBLIC_API_MODE || "next-api";

  if (apiMode === "spring") {
    // Spring Boot API 사용 시
    const springUrl = process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080";
    return new NextLeadersService(springUrl);
  }

  // 기본: Next.js API Routes
  return new NextLeadersService("/api");
}

export const leadersClient = createLeadersClient();
