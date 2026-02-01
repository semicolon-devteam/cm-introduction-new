"use client";

import { useState, useEffect } from "react";
import { ChartNoAxesCombined, Plus, X, GraduationCap } from "lucide-react";
import { SEOProjectCard, SEOProjectCardSkeleton } from "./SEOProjectCard";
import { getSEOSites, addSEOSite, type SEOSite } from "../_lib/seo-sites";
import { SEOOnboardingWizard, SEOTutorial, SEOGlossary } from "./index";

export function SEOProjectsSection() {
  const [projects, setProjects] = useState<SEOSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLearnSection, setShowLearnSection] = useState(false);

  useEffect(() => {
    const sites = getSEOSites();
    setProjects(sites);
    setLoading(false);
  }, []);

  const handleAddSite = (site: Omit<SEOSite, "id" | "createdAt" | "updatedAt">) => {
    addSEOSite(site);
    setProjects(getSEOSites());
    setShowAddModal(false);
  };

  if (loading) {
    return <SEOProjectsSectionSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">SEO 프로젝트</h2>
          <span className="text-xs text-gray-500 bg-[#25262b] px-2 py-0.5 rounded-full">
            {projects.length}개 프로젝트
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLearnSection(!showLearnSection)}
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
              showLearnSection
                ? "bg-purple-500/20 text-purple-400"
                : "text-gray-400 hover:text-white hover:bg-[#25262b]"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            SEO 학습
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            사이트 추가
          </button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <SEOProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty state if no projects */}
      {projects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
          <ChartNoAxesCombined className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">아직 등록된 SEO 프로젝트가 없습니다</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />첫 프로젝트 추가하기
          </button>
        </div>
      )}

      {/* SEO Learning Section */}
      {showLearnSection && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <GraduationCap className="w-5 h-5" />
            <h3 className="font-medium">SEO 학습 자료</h3>
          </div>
          <SEOOnboardingWizard />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <SEOTutorial />
            <SEOGlossary />
          </div>
        </div>
      )}

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal onClose={() => setShowAddModal(false)} onAdd={handleAddSite} />
      )}
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

export function SEOProjectsSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#25262b] rounded animate-pulse" />
        <div className="h-6 w-32 bg-[#25262b] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SEOProjectCardSkeleton />
        <SEOProjectCardSkeleton />
        <SEOProjectCardSkeleton />
      </div>
    </div>
  );
}
