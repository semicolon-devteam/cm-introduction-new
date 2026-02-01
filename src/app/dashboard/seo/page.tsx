"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Globe,
  Settings,
  Trash2,
  ExternalLink,
  BarChart3,
  Loader2,
  X,
  GraduationCap,
} from "lucide-react";

import {
  getSEOSites,
  addSEOSite,
  deleteSEOSite,
  getSiteKeywords,
  saveSiteStats,
  getAllSiteStats,
  type SEOSite,
  type SEOSiteStats,
} from "../_lib/seo-sites";
import { SEOOnboardingWizard, SEOTutorial, SEOGlossary } from "../_components";

export default function SEODashboardPage() {
  const [sites, setSites] = useState<SEOSite[]>([]);
  const [siteStats, setSiteStats] = useState<SEOSiteStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"sites" | "learn">("sites");

  // Load sites
  useEffect(() => {
    const loadedSites = getSEOSites();
    setSites(loadedSites);
    setSiteStats(getAllSiteStats());
    setIsLoading(false);
  }, []);

  // Fetch stats for all sites
  const fetchAllStats = useCallback(async () => {
    for (const site of sites) {
      if (site.searchConsole?.enabled) {
        try {
          const response = await fetch(
            `/api/dashboard/search-console?period=28days&siteUrl=${encodeURIComponent(site.searchConsole.siteUrl)}`,
          );
          const data = await response.json();

          if (data.connected && data.overview?.current) {
            const keywords = getSiteKeywords(site.id);
            saveSiteStats(site.id, {
              clicks: data.overview.current.clicks || 0,
              impressions: data.overview.current.impressions || 0,
              position: data.overview.current.position || 0,
              ctr: data.overview.current.ctr || 0,
              keywordCount: keywords.length,
            });
          }
        } catch (e) {
          console.error(`Failed to fetch stats for ${site.domain}:`, e);
        }
      }
    }
    setSiteStats(getAllSiteStats());
  }, [sites]);

  useEffect(() => {
    if (sites.length > 0) {
      void fetchAllStats();
    }
  }, [sites.length]);

  const handleDeleteSite = (siteId: string, siteName: string) => {
    if (
      confirm(`"${siteName}" 사이트를 삭제하시겠습니까?\n관련 키워드와 설정도 모두 삭제됩니다.`)
    ) {
      deleteSEOSite(siteId);
      setSites(getSEOSites());
    }
  };

  const getStatsForSite = (siteId: string) => {
    return siteStats.find((s) => s.siteId === siteId);
  };

  // Calculate total stats
  const totalStats = siteStats.reduce(
    (acc, stat) => ({
      clicks: acc.clicks + stat.clicks,
      impressions: acc.impressions + stat.impressions,
      keywords: acc.keywords + stat.keywordCount,
    }),
    { clicks: 0, impressions: 0, keywords: 0 },
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-400" />
                SEO 대시보드
              </h1>
              <p className="text-sm text-[#909296] mt-1">{sites.length}개 사이트 관리 중</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            사이트 추가
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 mb-6 bg-[#1a1b23] rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("sites")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "sites"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            사이트 관리
          </button>
          <button
            onClick={() => setActiveTab("learn")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === "learn"
                ? "bg-brand-primary text-white"
                : "text-[#909296] hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            SEO 학습
          </button>
        </div>

        {activeTab === "sites" ? (
          <>
            {/* 전체 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-[#909296]">총 클릭수</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalStats.clicks.toLocaleString()}
                </div>
                <p className="text-xs text-[#5c5f66] mt-1">최근 28일</p>
              </div>

              <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-[#909296]">총 노출수</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalStats.impressions.toLocaleString()}
                </div>
                <p className="text-xs text-[#5c5f66] mt-1">최근 28일</p>
              </div>

              <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-[#909296]">관리 키워드</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalStats.keywords}개</div>
                <p className="text-xs text-[#5c5f66] mt-1">전체 사이트</p>
              </div>
            </div>

            {/* 사이트 목록 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">내 사이트</h2>

              {sites.length === 0 ? (
                <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-12 text-center">
                  <Globe className="w-12 h-12 text-[#5c5f66] mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">등록된 사이트가 없습니다</h3>
                  <p className="text-sm text-[#909296] mb-4">SEO를 관리할 사이트를 추가해주세요.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    첫 사이트 추가하기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {sites.map((site) => {
                    const stats = getStatsForSite(site.id);
                    const keywords = getSiteKeywords(site.id);

                    return (
                      <div
                        key={site.id}
                        className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5 hover:border-[#4c4f54] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{site.icon}</span>
                            <div>
                              <h3 className="text-white font-medium">{site.name}</h3>
                              <p className="text-sm text-[#5c5f66]">{site.domain}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteSite(site.id, site.name)}
                              className="p-2 text-[#909296] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 통계 */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-[#25262b] rounded-lg p-3">
                            <div className="text-xs text-[#909296] mb-1">클릭</div>
                            <div className="text-lg font-semibold text-white">
                              {stats?.clicks?.toLocaleString() || "-"}
                            </div>
                          </div>
                          <div className="bg-[#25262b] rounded-lg p-3">
                            <div className="text-xs text-[#909296] mb-1">순위</div>
                            <div className="text-lg font-semibold text-white flex items-center gap-1">
                              {stats?.position?.toFixed(1) || "-"}
                              {stats?.position && stats.position < 10 && (
                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                              )}
                              {stats?.position && stats.position > 20 && (
                                <TrendingDown className="w-3 h-3 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div className="bg-[#25262b] rounded-lg p-3">
                            <div className="text-xs text-[#909296] mb-1">키워드</div>
                            <div className="text-lg font-semibold text-white">
                              {keywords.length}개
                            </div>
                          </div>
                        </div>

                        {/* 연동 상태 */}
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              site.searchConsole?.enabled
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[#373A40] text-[#909296]"
                            }`}
                          >
                            Search Console
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              site.analytics?.enabled
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[#373A40] text-[#909296]"
                            }`}
                          >
                            Analytics
                          </span>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/seo/${site.id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm"
                          >
                            SEO 관리
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/dashboard/seo/${site.id}/settings`}
                            className="p-2 text-[#909296] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="설정"
                          >
                            <Settings className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* SEO 학습 탭 */
          <div className="space-y-6">
            <SEOOnboardingWizard />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SEOTutorial />
              <SEOGlossary />
            </div>
          </div>
        )}

        {/* 사이트 추가 모달 */}
        {showAddModal && (
          <AddSiteModal
            onClose={() => setShowAddModal(false)}
            onAdd={(site) => {
              addSEOSite(site);
              setSites(getSEOSites());
              setShowAddModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
}

// 사이트 추가 모달
function AddSiteModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (site: Omit<SEOSite, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [icon, setIcon] = useState("🌐");
  const [scEnabled, setScEnabled] = useState(false);
  const [scSiteUrl, setScSiteUrl] = useState("");
  const [gaEnabled, setGaEnabled] = useState(false);
  const [gaPropertyId, setGaPropertyId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !domain.trim()) {
      alert("사이트 이름과 도메인을 입력해주세요.");
      return;
    }

    onAdd({
      name: name.trim(),
      domain: domain
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, ""),
      icon,
      searchConsole: scEnabled
        ? { enabled: true, siteUrl: scSiteUrl || `sc-domain:${domain.trim()}` }
        : undefined,
      analytics: gaEnabled ? { enabled: true, propertyId: gaPropertyId } : undefined,
    });
  };

  const iconOptions = ["🌐", "🏛️", "🏠", "💼", "🛒", "📰", "🎮", "📚", "🎨", "🔧"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1b23] rounded-xl border border-[#373A40] w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
          <h2 className="text-lg font-semibold text-white">새 사이트 추가</h2>
          <button
            onClick={onClose}
            className="p-1 text-[#909296] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* 아이콘 선택 */}
          <div>
            <label className="block text-sm text-[#909296] mb-2">아이콘</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 text-xl rounded-lg transition-colors ${
                    icon === emoji ? "bg-brand-primary" : "bg-[#25262b] hover:bg-[#2a2b33]"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 사이트 이름 */}
          <div>
            <label className="block text-sm text-[#909296] mb-2">사이트 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 내 블로그"
              className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* 도메인 */}
          <div>
            <label className="block text-sm text-[#909296] mb-2">도메인</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="예: example.com"
              className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Search Console */}
          <div className="bg-[#25262b] rounded-lg p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scEnabled}
                onChange={(e) => setScEnabled(e.target.checked)}
                className="rounded border-[#373A40] bg-[#1a1b23] text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-white">Search Console 연동</span>
            </label>
            {scEnabled && (
              <input
                type="text"
                value={scSiteUrl}
                onChange={(e) => setScSiteUrl(e.target.value)}
                placeholder="sc-domain:example.com"
                className="w-full mt-2 px-3 py-2 bg-[#1a1b23] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] text-sm focus:outline-none focus:border-brand-primary"
              />
            )}
          </div>

          {/* Google Analytics */}
          <div className="bg-[#25262b] rounded-lg p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gaEnabled}
                onChange={(e) => setGaEnabled(e.target.checked)}
                className="rounded border-[#373A40] bg-[#1a1b23] text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-white">Google Analytics 연동</span>
            </label>
            {gaEnabled && (
              <input
                type="text"
                value={gaPropertyId}
                onChange={(e) => setGaPropertyId(e.target.value)}
                placeholder="Property ID (예: 123456789)"
                className="w-full mt-2 px-3 py-2 bg-[#1a1b23] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] text-sm focus:outline-none focus:border-brand-primary"
              />
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#25262b] text-[#909296] rounded-lg hover:bg-[#2a2b33] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
