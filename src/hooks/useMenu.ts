/**
 * Menu 데이터 조회 Custom Hook
 * Development Philosophy - Hooks Layer (4️⃣)
 *
 * 책임:
 * - React state management
 * - API Client 호출 (브라우저 사이드)
 * - Error handling with user feedback
 * - Loading states for better UX
 */

"use client";

import { useState, useEffect } from "react";

import { menuClient } from "@/lib/api-clients/menu.client";

import type { MenuItem, GetMenusParams } from "@/models/menu.types";

interface UseMenuReturn {
  /** 메뉴 목록 (계층 구조) */
  menus: MenuItem[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 객체 */
  error: Error | null;
  /** 데이터 새로고침 함수 */
  refetch: () => Promise<void>;
}

/**
 * Menu 데이터 조회 Hook
 * - 계층 구조의 메뉴 목록 조회
 * - 디바이스 및 사용자 레벨 기반 필터링
 * - 에러 발생 시 빈 배열 반환 및 에러 상태 노출
 *
 * @param params - 조회 파라미터 (device, userLevel)
 *
 * @example
 * ```tsx
 * function HeaderContainer() {
 *   const { menus, isLoading, error } = useMenu({ device: 'pc', userLevel: 1 });
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return <Header menus={menus} />;
 * }
 * ```
 */
export function useMenu(params: GetMenusParams = {}): UseMenuReturn {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Factory로 생성된 싱글톤 API Client 사용
      const data = await menuClient.getMenus(params);

      setMenus(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("알 수 없는 오류가 발생했습니다.");
      setError(errorMessage);

      // 에러 발생 시에도 빈 배열로 UI 렌더링 가능하도록 설정
      setMenus([]);

      console.error("[useMenu] Failed to fetch menu data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // params가 변경되면 재조회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.device, params.userLevel]);

  return {
    menus,
    isLoading,
    error,
    refetch: fetchData,
  };
}
