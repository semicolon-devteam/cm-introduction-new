"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Globe,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

interface ImageAuditItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  altQuality: "good" | "poor" | "missing";
  filename: string;
  filenameIssue: boolean;
  suggestedAlt?: string;
}

interface ImageSEOAuditProps {
  domain: string;
  keywords: string[];
}

export function ImageSEOAudit({ domain, keywords }: ImageSEOAuditProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateAlt, setGenerateAlt] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<{
    totalImages: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    poorAltCount: number;
    filenameIssues: number;
    score: number;
    images: ImageAuditItem[];
  } | null>(null);

  const handleAudit = async () => {
    const targetUrl = url.trim()
      ? url.startsWith("http")
        ? url
        : `https://${domain}${url.startsWith("/") ? url : `/${url}`}`
      : `https://${domain}`;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/dashboard/seo/image-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, generateAltTags: generateAlt, keywords }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("이미지 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    void navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getQualityIcon = (quality: ImageAuditItem["altQuality"]) => {
    switch (quality) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-pink-400" />
        <h3 className="text-white font-medium">이미지 SEO 분석</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#25262b] border border-[#373A40] rounded-lg">
          <Globe className="w-4 h-4 text-[#5c5f66]" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="페이지 경로 (비워두면 메인 페이지)"
            className="flex-1 bg-transparent text-white placeholder-[#5c5f66] focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={() => void handleAudit()}
          disabled={loading}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "분석"}
        </button>
      </div>

      <label className="flex items-center gap-2 text-xs text-[#909296] mb-4">
        <input
          type="checkbox"
          checked={generateAlt}
          onChange={(e) => setGenerateAlt(e.target.checked)}
          className="rounded bg-[#25262b] border-[#373A40]"
        />
        <Sparkles className="w-3 h-3" />
        AI로 alt 태그 제안 생성
      </label>

      {result && (
        <div className="space-y-4">
          {/* Score & Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-[#25262b] rounded p-3 text-center">
              <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
              <p className="text-xs text-[#5c5f66]">점수</p>
            </div>
            <div className="bg-[#25262b] rounded p-3 text-center">
              <p className="text-2xl font-bold text-white">{result.totalImages}</p>
              <p className="text-xs text-[#5c5f66]">전체 이미지</p>
            </div>
            <div className="bg-[#25262b] rounded p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{result.imagesWithoutAlt}</p>
              <p className="text-xs text-[#5c5f66]">alt 없음</p>
            </div>
            <div className="bg-[#25262b] rounded p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{result.filenameIssues}</p>
              <p className="text-xs text-[#5c5f66]">파일명 이슈</p>
            </div>
          </div>

          {/* Image List */}
          <div className="space-y-2">
            <p className="text-xs text-[#5c5f66] font-medium">
              이미지 목록 ({result.images.length}개)
            </p>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {result.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border ${
                    img.altQuality === "good"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : img.altQuality === "poor"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getQualityIcon(img.altQuality)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate" title={img.filename}>
                        {img.filename || "(파일명 없음)"}
                      </p>
                      {img.hasAlt ? (
                        <p className="text-xs text-[#909296] mt-1">
                          alt: &ldquo;{img.alt}&rdquo;
                          {img.altQuality === "poor" && (
                            <span className="text-amber-400 ml-1">(품질 개선 필요)</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-red-400 mt-1">alt 태그 없음</p>
                      )}
                      {img.filenameIssue && (
                        <p className="text-xs text-amber-400 mt-1">
                          파일명 개선 필요 (의미있는 이름 권장)
                        </p>
                      )}
                      {img.suggestedAlt && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-[#1a1b23] rounded">
                          <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs text-cyan-400 flex-1">
                            제안: &ldquo;{img.suggestedAlt}&rdquo;
                          </span>
                          <button
                            onClick={() => handleCopy(`alt="${img.suggestedAlt}"`, idx)}
                            className="text-[#5c5f66] hover:text-white"
                          >
                            {copiedIdx === idx ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-6 text-[#5c5f66]">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">페이지의 이미지 SEO 상태를 분석합니다</p>
          <p className="text-xs mt-1">alt 태그, 파일명, 최적화 상태를 점검합니다</p>
        </div>
      )}
    </div>
  );
}
