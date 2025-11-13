/**
 * 게시물 API 클라이언트 팩토리
 * 클라이언트(Browser)에서 백엔드 API 호출 시 사용
 *
 * 역할: HTTP 요청을 통한 백엔드 API 호출
 * - Spring Boot API 호출 (프로덕션)
 * - Next.js API Route 호출 (로컬 개발)
 *
 * Development Philosophy: Factory Pattern + 1-Hop Rule
 */

"use client";

import { SpringPostsService } from "./implementations/spring-posts.service";
import { NextPostsService } from "./implementations/next-posts.service";

import type { IPostsService } from "./interfaces/posts.interface";

/**
 * 환경 변수를 통해 API 클라이언트 구현체 선택
 * NEXT_PUBLIC_USE_SPRING_BOOT=true -> Spring Boot API 호출 (1-Hop)
 * NEXT_PUBLIC_USE_SPRING_BOOT=false -> Next.js API Route 호출 (로컬 개발)
 */
export function createPostsClient(): IPostsService {
  const useSpringBoot = process.env.NEXT_PUBLIC_USE_SPRING_BOOT === "true";

  if (useSpringBoot) {
    // eslint-disable-next-line no-console
    console.log("[PostsClient] Using Spring Boot API Client (1-Hop)");
    return new SpringPostsService();
  }

  // eslint-disable-next-line no-console
  console.log("[PostsClient] Using Next.js API Client (Local Dev)");
  return new NextPostsService();
}

// 싱글톤 인스턴스 export
export const postsClient = createPostsClient();
