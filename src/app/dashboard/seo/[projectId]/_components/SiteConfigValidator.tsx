"use client";

import { useState } from "react";
import {
  FileCode,
  Bot,
  Loader2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SitemapResult {
  url: string;
  found: boolean;
  valid: boolean;
  urlCount: number;
  urls: { loc: string; lastmod?: string; status?: string }[];
  issues: { type: "error" | "warning" | "info"; message: string }[];
  sitemapIndex?: { sitemaps: string[] };
}

interface RobotsResult {
  url: string;
  found: boolean;
  content: string;
  userAgents: string[];
  sitemaps: string[];
  issues: { type: "error" | "warning" | "info"; message: string }[];
}

interface SiteConfigValidatorProps {
  domain: string;
}

export function SiteConfigValidator({ domain }: SiteConfigValidatorProps) {
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [robotsLoading, setRobotsLoading] = useState(false);
  const [sitemapResult, setSitemapResult] = useState<SitemapResult | null>(null);
  const [robotsResult, setRobotsResult] = useState<RobotsResult | null>(null);
  const [showSitemapUrls, setShowSitemapUrls] = useState(false);
  const [showRobotsContent, setShowRobotsContent] = useState(false);

  const handleCheckSitemap = async () => {
    setSitemapLoading(true);
    setSitemapResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/sitemap-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, checkUrls: false }),
      });
      const data = await response.json();
      if (data.success) {
        setSitemapResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("사이트맵 검증 중 오류가 발생했습니다.");
    } finally {
      setSitemapLoading(false);
    }
  };

  const handleCheckRobots = async () => {
    setRobotsLoading(true);
    setRobotsResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/robots-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();
      if (data.success) {
        setRobotsResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("robots.txt 검증 중 오류가 발생했습니다.");
    } finally {
      setRobotsLoading(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileCode className="w-5 h-5 text-violet-400" />
        <h3 className="text-white font-medium">사이트 설정 검증</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Sitemap 검증 */}
        <div className="bg-[#25262b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">Sitemap.xml</span>
            </div>
            <button
              onClick={() => void handleCheckSitemap()}
              disabled={sitemapLoading}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {sitemapLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "검증"}
            </button>
          </div>

          {sitemapResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {sitemapResult.found && sitemapResult.valid ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-[#909296]">
                  {sitemapResult.found
                    ? sitemapResult.valid
                      ? `유효함 (${sitemapResult.urlCount}개 URL)`
                      : "유효하지 않음"
                    : "찾을 수 없음"}
                </span>
              </div>

              {sitemapResult.sitemapIndex && (
                <div className="text-xs text-[#5c5f66]">
                  사이트맵 인덱스: {sitemapResult.sitemapIndex.sitemaps.length}개 하위 사이트맵
                </div>
              )}

              {sitemapResult.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {getIssueIcon(issue.type)}
                  <span className="text-[#909296]">{issue.message}</span>
                </div>
              ))}

              {sitemapResult.urls.length > 0 && (
                <>
                  <button
                    onClick={() => setShowSitemapUrls(!showSitemapUrls)}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                  >
                    {showSitemapUrls ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    URL 목록 {showSitemapUrls ? "숨기기" : "보기"}
                  </button>
                  {showSitemapUrls && (
                    <div className="max-h-40 overflow-y-auto space-y-1 mt-2">
                      {sitemapResult.urls.slice(0, 20).map((url, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <a
                            href={url.loc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline truncate flex-1"
                          >
                            {url.loc}
                          </a>
                          {url.lastmod && <span className="text-[#5c5f66]">{url.lastmod}</span>}
                        </div>
                      ))}
                      {sitemapResult.urls.length > 20 && (
                        <p className="text-[#5c5f66] text-xs">
                          ...외 {sitemapResult.urls.length - 20}개
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <a
                href={sitemapResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#5c5f66] hover:text-white mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                {sitemapResult.url}
              </a>
            </div>
          )}

          {!sitemapResult && !sitemapLoading && (
            <p className="text-xs text-[#5c5f66]">검증 버튼을 클릭하여 sitemap.xml을 확인하세요</p>
          )}
        </div>

        {/* Robots.txt 검증 */}
        <div className="bg-[#25262b] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">Robots.txt</span>
            </div>
            <button
              onClick={() => void handleCheckRobots()}
              disabled={robotsLoading}
              className="px-3 py-1 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-700 disabled:opacity-50"
            >
              {robotsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "검증"}
            </button>
          </div>

          {robotsResult && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {robotsResult.found ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs text-[#909296]">
                  {robotsResult.found ? "발견됨" : "찾을 수 없음"}
                </span>
              </div>

              {robotsResult.userAgents.length > 0 && (
                <div className="text-xs text-[#5c5f66]">
                  User-Agent: {robotsResult.userAgents.slice(0, 3).join(", ")}
                  {robotsResult.userAgents.length > 3 &&
                    ` 외 ${robotsResult.userAgents.length - 3}개`}
                </div>
              )}

              {robotsResult.sitemaps.length > 0 && (
                <div className="text-xs text-emerald-400">
                  Sitemap 선언: {robotsResult.sitemaps.length}개
                </div>
              )}

              {robotsResult.issues.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  {getIssueIcon(issue.type)}
                  <span className="text-[#909296]">{issue.message}</span>
                </div>
              ))}

              {robotsResult.content && (
                <>
                  <button
                    onClick={() => setShowRobotsContent(!showRobotsContent)}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                  >
                    {showRobotsContent ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    내용 {showRobotsContent ? "숨기기" : "보기"}
                  </button>
                  {showRobotsContent && (
                    <pre className="max-h-40 overflow-y-auto text-xs text-[#909296] bg-[#1a1b23] p-2 rounded mt-2 whitespace-pre-wrap">
                      {robotsResult.content}
                    </pre>
                  )}
                </>
              )}

              <a
                href={robotsResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#5c5f66] hover:text-white mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                {robotsResult.url}
              </a>
            </div>
          )}

          {!robotsResult && !robotsLoading && (
            <p className="text-xs text-[#5c5f66]">검증 버튼을 클릭하여 robots.txt를 확인하세요</p>
          )}
        </div>
      </div>
    </div>
  );
}
