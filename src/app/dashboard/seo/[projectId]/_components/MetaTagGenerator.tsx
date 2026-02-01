"use client";

import { useState } from "react";
import { Code, Copy, Check, Loader2, Globe } from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface MetaTagGeneratorProps {
  site: SEOSite;
  keywords: string[];
}

export function MetaTagGenerator({ site, keywords }: MetaTagGeneratorProps) {
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
