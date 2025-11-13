/**
 * Activity API 클라이언트 팩토리
 * 클라이언트(Browser)에서 백엔드 API 호출 시 사용
 *
 * Development Philosophy: Factory Pattern + 1-Hop Rule
 */

"use client";

import { SpringActivityService } from "./implementations/spring-activity.service";
import { NextActivityService } from "./implementations/next-activity.service";

import type { IActivityService } from "./interfaces/activity.interface";

/**
 * 환경 변수를 통해 API 클라이언트 구현체 선택
 * NEXT_PUBLIC_USE_SPRING_BOOT=true -> Spring Boot API 호출 (1-Hop)
 * NEXT_PUBLIC_USE_SPRING_BOOT=false -> Next.js API Route 호출 (로컬 개발)
 */
export function createActivityClient(): IActivityService {
  const useSpringBoot = process.env.NEXT_PUBLIC_USE_SPRING_BOOT === "true";

  if (useSpringBoot) {
    // eslint-disable-next-line no-console
    console.log("[ActivityClient] Using Spring Boot API Client (1-Hop)");
    return new SpringActivityService();
  }

  // eslint-disable-next-line no-console
  console.log("[ActivityClient] Using Next.js API Client (Local Dev)");
  return new NextActivityService();
}

// 싱글톤 인스턴스 export
export const activityClient = createActivityClient();
