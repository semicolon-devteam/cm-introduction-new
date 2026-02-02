"use client";

import { useState } from "react";
import { Copy, Check, Loader2, Tag, ChevronDown, ChevronUp } from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface GTMTagGeneratorProps {
  site: SEOSite;
  keywords: string[];
}

export function GTMTagGenerator({ site, keywords }: GTMTagGeneratorProps) {
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
