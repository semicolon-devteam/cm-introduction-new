/**
 * SEO 프로젝트 설정
 * 여러 프로젝트의 Google Search Console 및 Analytics 설정을 관리
 */

export interface SEOProjectConfig {
  id: string;
  name: string;
  description?: string;
  domain: string;
  searchConsole: {
    siteUrl: string; // sc-domain:example.com 또는 https://example.com
    enabled: boolean;
  };
  analytics: {
    propertyId: string; // GA4 Property ID (예: 123456789)
    enabled: boolean;
  };
  meta?: {
    pixelId?: string;
    enabled: boolean;
  };
  adsense?: {
    publisherId?: string;
    enabled: boolean;
  };
  naver?: {
    siteId?: string;
    enabled: boolean;
  };
  gtm?: {
    containerId?: string; // GTM Container ID (예: GTM-XXXXXXX)
    enabled: boolean;
  };
  icon?: string; // 이모지 또는 아이콘 이름
  color?: string; // 테마 색상
}

export interface SEOProjectSummary {
  projectId: string;
  searchConsole?: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    trend: "up" | "down" | "neutral";
    changePercent?: number;
  };
  analytics?: {
    users: number;
    sessions: number;
    pageviews: number;
    bounceRate: number;
    trend: "up" | "down" | "neutral";
    changePercent?: number;
  };
  lastUpdated: string;
}

/**
 * 프로젝트 설정 목록
 * 새 프로젝트 추가 시 여기에 설정 추가
 */
export const SEO_PROJECTS: SEOProjectConfig[] = [
  {
    id: "jungchipan",
    name: "정치판",
    description: "정치 뉴스 및 여론 분석 플랫폼",
    domain: "jungchipan.net",
    searchConsole: {
      siteUrl: "sc-domain:jungchipan.net",
      enabled: true,
    },
    analytics: {
      propertyId: "516515301",
      enabled: true,
    },
    naver: {
      siteId: "jungchipan.net",
      enabled: true,
    },
    gtm: {
      containerId: "", // GTM Container ID 설정 필요
      enabled: false,
    },
    icon: "🏛️",
    color: "#3B82F6", // blue
  },
  {
    id: "land",
    name: "랜드",
    description: "부동산 정보 서비스",
    domain: "land.example.com",
    searchConsole: {
      siteUrl: "", // Search Console 등록 후 설정
      enabled: false,
    },
    analytics: {
      propertyId: "",
      enabled: false,
    },
    icon: "🏠",
    color: "#10B981", // green
  },
  {
    id: "office",
    name: "오피스",
    description: "사무실 관리 솔루션",
    domain: "office.example.com",
    searchConsole: {
      siteUrl: "",
      enabled: false,
    },
    analytics: {
      propertyId: "",
      enabled: false,
    },
    icon: "🏢",
    color: "#8B5CF6", // purple
  },
];

/**
 * 프로젝트 ID로 설정 조회
 */
export function getProjectConfig(projectId: string): SEOProjectConfig | undefined {
  return SEO_PROJECTS.find((p) => p.id === projectId);
}

/**
 * 활성화된 프로젝트만 조회
 */
export function getActiveProjects(): SEOProjectConfig[] {
  return SEO_PROJECTS.filter((p) => p.searchConsole.enabled || p.analytics.enabled);
}

/**
 * 모든 프로젝트 조회 (설정 페이지용)
 */
export function getAllProjects(): SEOProjectConfig[] {
  return SEO_PROJECTS;
}
