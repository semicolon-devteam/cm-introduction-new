/**
 * SEO Command Center - 통합 타입 정의
 *
 * 모든 SEO 플랫폼의 데이터 타입을 통합 관리
 */

// 공통 메트릭 타입
export interface BaseMetric {
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
}

// 트렌드 타입
export type TrendType = "up" | "down" | "neutral";

// 플랫폼 타입
export type SEOPlatform = "searchConsole" | "analytics" | "meta" | "naver" | "adsense";

// ============================================
// Google Search Console
// ============================================
export interface SearchConsoleData {
  connected: boolean;
  siteUrl?: string;
  period?: { startDate: string; endDate: string };
  overview?: {
    current: SearchConsoleMetrics;
    previous: SearchConsoleMetrics;
    change: SearchConsoleMetrics;
  };
  topQueries?: SearchConsoleQuery[];
  topPages?: SearchConsolePage[];
  deviceBreakdown?: SearchConsoleDevice[];
  countryBreakdown?: SearchConsoleCountry[];
  dailyData?: SearchConsoleDailyData[];
  error?: string;
}

export interface SearchConsoleMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsolePage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleDevice {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleCountry {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleDailyData {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// ============================================
// Google Analytics
// ============================================
export interface AnalyticsData {
  connected: boolean;
  propertyId?: string;
  metrics?: {
    activeUsers: BaseMetric;
    sessions: BaseMetric;
    pageViews: BaseMetric;
    bounceRate: BaseMetric;
    avgSessionDuration: BaseMetric;
    newUsers: BaseMetric;
  };
  topPages?: AnalyticsPage[];
  trafficSources?: AnalyticsTrafficSource[];
  dailyData?: AnalyticsDailyData[];
  error?: string;
}

export interface AnalyticsPage {
  path: string;
  pageViews: number;
  avgTime: number;
}

export interface AnalyticsTrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface AnalyticsDailyData {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
}

// ============================================
// Meta Business (Facebook/Instagram)
// ============================================
export interface MetaData {
  connected: boolean;
  pixelId?: string;
  demo?: boolean;
  metrics?: {
    pageViews: BaseMetric;
    uniqueVisitors: BaseMetric;
    contentViews: BaseMetric;
    addToCart?: BaseMetric;
    purchases?: BaseMetric;
    leads?: BaseMetric;
  };
  trafficSources?: MetaTrafficSource[];
  dailyData?: MetaDailyData[];
  error?: string;
}

export interface MetaTrafficSource {
  source: string;
  sessions: number;
  percentage: number;
}

export interface MetaDailyData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
}

// ============================================
// Naver Search Advisor
// ============================================
export interface NaverData {
  connected: boolean;
  siteId?: string;
  demo?: boolean;
  metrics?: {
    clicks: BaseMetric;
    impressions: BaseMetric;
    ctr: BaseMetric;
    avgPosition: BaseMetric;
  };
  topQueries?: NaverQuery[];
  topPages?: NaverPage[];
  dailyData?: NaverDailyData[];
  indexStatus?: {
    indexed: number;
    submitted: number;
    errors: number;
  };
  error?: string;
}

export interface NaverQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface NaverPage {
  page: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface NaverDailyData {
  date: string;
  clicks: number;
  impressions: number;
}

// ============================================
// Google AdSense
// ============================================
export interface AdSenseData {
  connected: boolean;
  accountId?: string;
  demo?: boolean;
  metrics?: {
    estimatedEarnings: BaseMetric;
    pageViews: BaseMetric;
    clicks: BaseMetric;
    ctr: BaseMetric;
    cpc: BaseMetric;
    rpm: BaseMetric;
  };
  topAdUnits?: AdSenseAdUnit[];
  topPages?: AdSensePage[];
  dailyData?: AdSenseDailyData[];
  error?: string;
}

export interface AdSenseAdUnit {
  name: string;
  earnings: number;
  clicks: number;
  impressions: number;
}

export interface AdSensePage {
  page: string;
  earnings: number;
  pageViews: number;
  rpm: number;
}

export interface AdSenseDailyData {
  date: string;
  earnings: number;
  pageViews: number;
  clicks: number;
}

// ============================================
// 통합 SEO 데이터
// ============================================
export interface UnifiedSEOData {
  projectId: string;
  lastUpdated: string;
  searchConsole?: SearchConsoleData;
  analytics?: AnalyticsData;
  meta?: MetaData;
  naver?: NaverData;
  adsense?: AdSenseData;
}

// 플랫폼 상태 요약
export interface PlatformStatus {
  platform: SEOPlatform;
  connected: boolean;
  hasData: boolean;
  error?: string;
}

// SEO 인사이트 (AI 분석용)
export interface SEOInsight {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  description: string;
  platform: SEOPlatform;
  metric?: string;
  value?: number;
  change?: number;
  recommendation?: string;
  createdAt: string;
}

// SEO 태스크 (작업 관리용)
export interface SEOTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  platform?: SEOPlatform;
  dueDate?: string;
  completedAt?: string;
  beforeMetrics?: Record<string, number>;
  afterMetrics?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
