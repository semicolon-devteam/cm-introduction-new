/**
 * Activity Domain Types
 * 사용자 활동 관련 타입 정의
 */

/**
 * 활동 타입
 */
export type ActivityType = 'post_created' | 'comment_created' | 'post_liked' | 'user_followed';

/**
 * 사용자 활동 정보
 */
export interface Activity {
  /** 활동 ID */
  id: string;
  /** 활동 타입 */
  type: ActivityType;
  /** 활동 제목 */
  title: string;
  /** 활동 설명 */
  description: string;
  /** 활동 발생 시각 */
  createdAt: string;
  /** 관련 링크 (optional) */
  link?: string;
  /** 아이콘 이름 (optional) */
  icon?: string;
}

/**
 * 사용자 활동 조회 파라미터
 */
export interface GetActivitiesParams {
  /** 사용자 ID */
  userId: string;
  /** 조회할 활동 개수 (기본값: 5) */
  limit?: number;
  /** 활동 타입 필터 (optional) */
  type?: ActivityType;
}

/**
 * 사용자 활동 조회 응답
 */
export interface GetActivitiesResponse {
  /** 활동 목록 */
  activities: Activity[];
  /** 전체 활동 수 */
  total: number;
}
