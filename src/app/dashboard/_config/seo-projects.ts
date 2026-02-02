/**
 * SEO 프로젝트 설정 (서버사이드용)
 * seo-sites.ts의 서버사이드 버전
 */

export interface ProjectConfig {
  id: string;
  name: string;
  domain: string;
  icon: string;
  color?: string;
  description?: string;
  searchConsole?: {
    enabled: boolean;
    siteUrl: string;
  };
  analytics?: {
    enabled: boolean;
    propertyId: string;
  };
  gtm?: {
    containerId: string;
    enabled: boolean;
  };
  keywords?: string[];
}

const SEO_PROJECTS: ProjectConfig[] = [
  {
    id: "jungchipan",
    name: "정치판",
    domain: "jungchipan.net",
    icon: "🏛️",
    color: "#3B82F6",
    description: "정치 뉴스 및 여론 분석 플랫폼",
    searchConsole: {
      enabled: true,
      siteUrl: "sc-domain:jungchipan.net",
    },
    analytics: {
      enabled: true,
      propertyId: "516515301",
    },
    gtm: {
      containerId: "GTM-TJHH9X6N",
      enabled: true,
    },
    keywords: ["정치", "국회", "뉴스", "정책", "선거", "여론", "정당"],
  },
  {
    id: "land",
    name: "랜드",
    domain: "land.example.com",
    icon: "🏠",
    color: "#10B981",
    description: "부동산 정보 서비스",
    searchConsole: {
      enabled: false,
      siteUrl: "",
    },
    analytics: {
      enabled: false,
      propertyId: "",
    },
  },
  {
    id: "office",
    name: "오피스",
    domain: "office.example.com",
    icon: "🏢",
    color: "#8B5CF6",
    description: "사무실 관리 솔루션",
    searchConsole: {
      enabled: false,
      siteUrl: "",
    },
    analytics: {
      enabled: false,
      propertyId: "",
    },
  },
];

/**
 * 프로젝트 설정 조회
 */
export function getProjectConfig(projectId: string): ProjectConfig | null {
  return SEO_PROJECTS.find((p) => p.id === projectId) || null;
}

/**
 * 프로젝트 키워드 조회
 */
export function getProjectKeywords(projectId: string): string[] {
  const project = getProjectConfig(projectId);
  return project?.keywords || [];
}

/**
 * 모든 프로젝트 조회
 */
export function getAllProjects(): ProjectConfig[] {
  return SEO_PROJECTS;
}
