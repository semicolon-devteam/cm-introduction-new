"use client";

import { useState } from "react";
import { Loader2, Send, Webhook } from "lucide-react";

import type { SEOSite } from "@app/dashboard/_lib/seo-sites";

interface IndexNowSubmitterProps {
  site: SEOSite;
}

export function IndexNowSubmitter({ site }: IndexNowSubmitterProps) {
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
