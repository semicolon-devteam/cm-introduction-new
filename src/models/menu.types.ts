/**
 * Menu 관련 TypeScript 타입 정의
 * DB 테이블: public.menu
 */

/**
 * 메뉴 타입 (DB enum: menu_type)
 */
export type MenuType = "link" | "board";

/**
 * 메뉴 서브타입 (DB enum: menu_sub_type)
 */
export type MenuSubType = "common" | "partner";

/**
 * DB menu 테이블 구조
 */
export interface Menu {
  /** 메뉴 ID */
  id: number;
  /** 부모 메뉴 ID (최상위 메뉴는 null) */
  parent_id: number | null;
  /** 메뉴 이름 */
  name: string;
  /** 메뉴 타입 */
  type: MenuType;
  /** 메뉴 서브타입 */
  sub_type: MenuSubType;
  /** 연결된 게시판 ID (type이 'board'일 경우) */
  board_id: number | null;
  /** 링크 URL (type이 'link'일 경우) */
  link_url: string | null;
  /** 표시 순서 */
  display_order: number;
  /** PC 활성화 여부 */
  is_pc_enabled: boolean;
  /** 모바일 활성화 여부 */
  is_mobile_enabled: boolean;
  /** 접근 필요 레벨 */
  required_level: number;
  /** 생성일 */
  created_at?: string;
  /** 수정일 */
  updated_at?: string | null;
  /** 삭제일 */
  deleted_at?: string | null;
}

/**
 * 계층 구조의 메뉴 아이템
 */
export interface MenuItem {
  /** 메뉴 ID */
  id: number;
  /** 메뉴 이름 */
  name: string;
  /** 메뉴 타입 */
  type: MenuType;
  /** 게시판 ID */
  board_id: number | null;
  /** 링크 URL */
  link_url: string | null;
  /** 접근 필요 레벨 */
  required_level: number;
  /** 하위 메뉴 목록 */
  children?: MenuItem[];
}

/**
 * 메뉴 목록 조회 응답
 */
export interface GetMenusResponse {
  /** 메뉴 목록 (계층 구조) */
  menus: MenuItem[];
}

/**
 * 메뉴 목록 조회 파라미터
 */
export interface GetMenusParams {
  /** 디바이스 타입 (선택적) */
  device?: "pc" | "mobile";
  /** 사용자 레벨 (권한 필터링용, 선택적) */
  userLevel?: number;
}
