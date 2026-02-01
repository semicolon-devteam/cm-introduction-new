"use client";

import { useState } from "react";
import { Settings, Check, AlertCircle } from "lucide-react";

import { updateSEOSite, type SEOSite } from "@app/dashboard/_lib/seo-sites";

interface SettingsTabProps {
  site: SEOSite;
}

export function SettingsTab({ site: initialSite }: SettingsTabProps) {
  const [site, setSite] = useState(initialSite);
  const [saved, setSaved] = useState(false);

  // Automation settings
  const [automation, setAutomation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`seo-automation-${initialSite.id}`);
      if (saved) return JSON.parse(saved);
    }
    return {
      autoMetaTags: true,
      autoIndexNow: true,
      weeklyReport: false,
    };
  });

  const handleSaveAutomation = () => {
    localStorage.setItem(`seo-automation-${site.id}`, JSON.stringify(automation));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdateSite = (updates: Partial<SEOSite>) => {
    const updated = updateSEOSite(site.id, updates);
    if (updated) {
      setSite(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 사이트 정보 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-[#909296]" />
          <h3 className="text-white font-medium">사이트 정보</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#909296] mb-2">사이트 이름</label>
            <input
              type="text"
              value={site.name}
              onChange={(e) => handleUpdateSite({ name: e.target.value })}
              className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-[#909296] mb-2">도메인</label>
            <input
              type="text"
              value={site.domain}
              disabled
              className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-[#5c5f66] cursor-not-allowed"
            />
            <p className="text-xs text-[#5c5f66] mt-1">도메인은 변경할 수 없습니다.</p>
          </div>
        </div>
      </div>

      {/* 연동 설정 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] divide-y divide-[#373A40]">
        <div className="p-5">
          <h3 className="text-white font-medium mb-4">연동 설정</h3>
        </div>

        {/* Search Console */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Google Search Console</h4>
              <p className="text-xs text-[#909296] mt-1">검색 성과 데이터 연동</p>
            </div>
            <span
              className={`px-2 py-0.5 text-xs rounded ${
                site.searchConsole?.enabled
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-[#373A40] text-[#909296]"
              }`}
            >
              {site.searchConsole?.enabled ? "연결됨" : "미연결"}
            </span>
          </div>
          {site.searchConsole?.enabled && (
            <div className="mt-3 text-xs text-[#5c5f66]">
              Site URL: {site.searchConsole.siteUrl}
            </div>
          )}
        </div>

        {/* Analytics */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Google Analytics</h4>
              <p className="text-xs text-[#909296] mt-1">GA4 트래픽 데이터 연동</p>
            </div>
            <span
              className={`px-2 py-0.5 text-xs rounded ${
                site.analytics?.enabled
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-[#373A40] text-[#909296]"
              }`}
            >
              {site.analytics?.enabled ? "연결됨" : "미연결"}
            </span>
          </div>
          {site.analytics?.enabled && (
            <div className="mt-3 text-xs text-[#5c5f66]">
              Property ID: {site.analytics.propertyId}
            </div>
          )}
        </div>
      </div>

      {/* 자동화 설정 */}
      <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">자동화 설정</h3>
          <button
            onClick={handleSaveAutomation}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "저장됨" : "저장"}
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={automation.autoMetaTags}
              onChange={(e) => setAutomation({ ...automation, autoMetaTags: e.target.checked })}
              className="rounded border-[#373A40] bg-[#25262b] text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm text-white">자동 메타태그 추천</span>
              <p className="text-xs text-[#5c5f66]">
                새 콘텐츠에 대한 메타태그를 자동으로 추천합니다.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={automation.autoIndexNow}
              onChange={(e) => setAutomation({ ...automation, autoIndexNow: e.target.checked })}
              className="rounded border-[#373A40] bg-[#25262b] text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm text-white">자동 IndexNow 제출</span>
              <p className="text-xs text-[#5c5f66]">
                새 페이지 발행 시 자동으로 색인을 요청합니다.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={automation.weeklyReport}
              onChange={(e) => setAutomation({ ...automation, weeklyReport: e.target.checked })}
              className="rounded border-[#373A40] bg-[#25262b] text-brand-primary focus:ring-brand-primary"
            />
            <div>
              <span className="text-sm text-white">주간 리포트 알림</span>
              <p className="text-xs text-[#5c5f66]">매주 월요일 SEO 성과 리포트를 생성합니다.</p>
            </div>
          </label>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-400">환경 변수 설정 필요</h4>
            <p className="text-xs text-[#909296] mt-1">
              Search Console과 Analytics 연동을 위해서는 Vercel 환경 변수에
              <code className="px-1 bg-[#25262b] rounded mx-1">GOOGLE_CLIENT_EMAIL</code>과
              <code className="px-1 bg-[#25262b] rounded mx-1">GOOGLE_PRIVATE_KEY</code>가 설정되어
              있어야 합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
