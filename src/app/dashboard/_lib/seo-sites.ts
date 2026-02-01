/**
 * 멀티 사이트 SEO 관리 유틸리티
 */

export interface SEOSite {
  id: string;
  name: string;
  domain: string;
  icon: string;
  searchConsole?: {
    enabled: boolean;
    siteUrl: string;
  };
  analytics?: {
    enabled: boolean;
    propertyId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SEOSiteStats {
  siteId: string;
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
  keywordCount: number;
  lastUpdated: string;
}

const STORAGE_KEY = "seo-sites";
const STATS_KEY = "seo-sites-stats";

/**
 * 기본 사이트 목록 (마이그레이션용)
 */
const DEFAULT_SITES: SEOSite[] = [
  {
    id: "jungchipan",
    name: "정치판",
    domain: "jungchipan.net",
    icon: "🏛️",
    searchConsole: {
      enabled: true,
      siteUrl: "sc-domain:jungchipan.net",
    },
    analytics: {
      enabled: true,
      propertyId: "516515301",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * 모든 사이트 가져오기
 */
export function getSEOSites(): SEOSite[] {
  if (typeof window === "undefined") return DEFAULT_SITES;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // 첫 로드시 기본 사이트 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SITES));
    return DEFAULT_SITES;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SITES;
  }
}

/**
 * 사이트 ID로 조회
 */
export function getSEOSite(siteId: string): SEOSite | null {
  const sites = getSEOSites();
  return sites.find((s) => s.id === siteId) || null;
}

/**
 * 사이트 추가
 */
export function addSEOSite(site: Omit<SEOSite, "id" | "createdAt" | "updatedAt">): SEOSite {
  const sites = getSEOSites();

  const newSite: SEOSite = {
    ...site,
    id: generateSiteId(site.domain),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sites.push(newSite);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));

  return newSite;
}

/**
 * 사이트 수정
 */
export function updateSEOSite(siteId: string, updates: Partial<SEOSite>): SEOSite | null {
  const sites = getSEOSites();
  const index = sites.findIndex((s) => s.id === siteId);

  if (index === -1) return null;

  sites[index] = {
    ...sites[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  return sites[index];
}

/**
 * 사이트 삭제
 */
export function deleteSEOSite(siteId: string): boolean {
  const sites = getSEOSites();
  const filtered = sites.filter((s) => s.id !== siteId);

  if (filtered.length === sites.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  // 관련 데이터도 삭제
  localStorage.removeItem(`seo-keywords-${siteId}`);
  localStorage.removeItem(`seo-automation-${siteId}`);
  localStorage.removeItem(`seo-gtm-${siteId}`);

  return true;
}

/**
 * 사이트 통계 저장
 */
export function saveSiteStats(
  siteId: string,
  stats: Omit<SEOSiteStats, "siteId" | "lastUpdated">,
): void {
  if (typeof window === "undefined") return;

  const allStats = getAllSiteStats();
  const index = allStats.findIndex((s) => s.siteId === siteId);

  const newStats: SEOSiteStats = {
    ...stats,
    siteId,
    lastUpdated: new Date().toISOString(),
  };

  if (index === -1) {
    allStats.push(newStats);
  } else {
    allStats[index] = newStats;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(allStats));
}

/**
 * 모든 사이트 통계 가져오기
 */
export function getAllSiteStats(): SEOSiteStats[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STATS_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 사이트 통계 가져오기
 */
export function getSiteStats(siteId: string): SEOSiteStats | null {
  const allStats = getAllSiteStats();
  return allStats.find((s) => s.siteId === siteId) || null;
}

/**
 * 도메인에서 사이트 ID 생성
 */
function generateSiteId(domain: string): string {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase();
}

/**
 * 사이트 키워드 가져오기
 */
export function getSiteKeywords(siteId: string): string[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(`seo-keywords-${siteId}`);
  if (!stored) return [];

  try {
    const keywords = JSON.parse(stored);
    return keywords.map((k: { text: string }) => k.text);
  } catch {
    return [];
  }
}
