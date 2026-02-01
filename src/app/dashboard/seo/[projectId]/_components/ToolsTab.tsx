"use client";

import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Loader2,
  Send,
  Globe,
  Tag,
  Webhook,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface ToolsTabProps {
  site: SEOSite;
  keywords: string[];
}

export function ToolsTab({ site, keywords }: ToolsTabProps) {
  return (
    <div className="space-y-6">
      <MetaTagGenerator site={site} keywords={keywords} />
      <GTMTagGenerator site={site} keywords={keywords} />
      <IndexNowSubmitter site={site} />
    </div>
  );
}

// 메타태그 생성기
function MetaTagGenerator({ site, keywords }: { site: SEOSite; keywords: string[] }) {
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    metaTags: Record<string, string>;
    htmlCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/generate-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.startsWith("http")
            ? url
            : `https://${site.domain}${url.startsWith("/") ? url : `/${url}`}`,
          keywords,
          domain: site.domain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          metaTags: data.metaTags,
          htmlCode: data.htmlCode,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("메타태그 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result?.htmlCode) return;
    void navigator.clipboard.writeText(result.htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-medium">AI 메타태그 생성기</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg">
          <Globe className="w-4 h-4 text-[#5c5f66]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="페이지 경로 또는 전체 URL"
            className="flex-1 bg-transparent text-white placeholder-[#5c5f66] focus:outline-none"
          />
        </div>
        <button
          onClick={() => void handleGenerate()}
          disabled={generating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : "생성"}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-[#25262b] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#909296]">생성된 메타태그</span>
              <button
                onClick={() => handleCopy()}
                className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-primary/80"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <pre className="text-xs text-[#909296] whitespace-pre-wrap overflow-x-auto font-mono">
              {result.htmlCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// GTM 태그 생성기
function GTMTagGenerator({ site, keywords }: { site: SEOSite; keywords: string[] }) {
  const [containerId, setContainerId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`seo-gtm-${site.id}`) || "";
    }
    return "";
  });
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    scripts: { head: string; body: string };
    dataLayerEvents: string;
    aiSuggestions?: {
      tags: { name: string; type: string; trigger: string; purpose: string }[];
      recommendations: string[];
    };
  } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!containerId.trim()) {
      alert("GTM Container ID를 입력해주세요.");
      return;
    }

    localStorage.setItem(`seo-gtm-${site.id}`, containerId);
    setGenerating(true);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/gtm-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          containerId,
          domain: site.domain,
          keywords,
          pageType: "homepage",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          scripts: data.scripts,
          dataLayerEvents: data.dataLayerEvents,
          aiSuggestions: data.aiSuggestions,
        });
        setExpanded(true);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("GTM 태그 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (type: string, code: string) => {
    void navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-amber-400" />
        <h3 className="text-white font-medium">GTM 태그 생성기</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={containerId}
          onChange={(e) => setContainerId(e.target.value)}
          placeholder="GTM-XXXXXXX"
          className="flex-1 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary"
        />
        <button
          onClick={() => void handleGenerate()}
          disabled={generating}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : "생성"}
        </button>
      </div>

      {result && (
        <div className="space-y-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-[#909296] hover:text-white"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            생성된 코드 {expanded ? "숨기기" : "보기"}
          </button>

          {expanded && (
            <>
              <CodeBlock
                label="Head 스크립트"
                code={result.scripts.head}
                copied={copied === "head"}
                onCopy={() => handleCopy("head", result.scripts.head)}
              />
              <CodeBlock
                label="Body 스크립트"
                code={result.scripts.body}
                copied={copied === "body"}
                onCopy={() => handleCopy("body", result.scripts.body)}
              />
              {result.aiSuggestions?.recommendations && (
                <div className="bg-[#25262b] rounded-lg p-4">
                  <span className="text-sm text-amber-400 font-medium">AI 추천</span>
                  <ul className="mt-2 space-y-1">
                    {result.aiSuggestions.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-[#909296]">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// IndexNow 제출
function IndexNowSubmitter({ site }: { site: SEOSite }) {
  const [urls, setUrls] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    results: { engine: string; success: boolean; status?: number }[];
  } | null>(null);

  const handleSubmit = async () => {
    if (!urls.trim()) {
      alert("URL을 입력해주세요.");
      return;
    }

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    if (urlList.length === 0) {
      alert("유효한 URL이 없습니다.");
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/dashboard/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: urlList,
          host: site.domain,
          searchEngines: ["naver", "bing"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          message: data.message,
          results: data.results,
        });
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("IndexNow 제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Webhook className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-medium">IndexNow 즉시 색인 요청</h3>
      </div>

      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder={`색인할 URL을 입력하세요 (줄바꿈으로 구분)\n예:\nhttps://${site.domain}/page1\nhttps://${site.domain}/page2`}
        rows={4}
        className="w-full px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none mb-4"
      />

      <button
        onClick={() => void handleSubmit()}
        disabled={submitting}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            제출 중...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            색인 요청
          </>
        )}
      </button>

      {result && (
        <div className="mt-4 bg-[#25262b] rounded-lg p-4">
          <p className="text-sm text-white mb-2">{result.message}</p>
          <div className="flex gap-2">
            {result.results.map((r, idx) => (
              <span
                key={idx}
                className={`px-2 py-1 text-xs rounded ${
                  r.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {r.engine}: {r.success ? "성공" : "실패"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  label,
  code,
  copied,
  onCopy,
}: {
  label: string;
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="bg-[#25262b] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#909296]">{label}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-primary/80"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre className="text-xs text-[#909296] whitespace-pre-wrap overflow-x-auto font-mono">
        {code}
      </pre>
    </div>
  );
}
