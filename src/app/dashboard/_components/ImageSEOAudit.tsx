"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Globe,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileImage,
  Tag,
  Maximize2,
} from "lucide-react";

interface ImageAuditItem {
  src: string;
  alt: string | null;
  hasAlt: boolean;
  altQuality: "good" | "needs_improvement" | "missing";
  width: number | null;
  height: number | null;
  hasExplicitSize: boolean;
  fileType: string | null;
  isOptimized: boolean;
  issues: string[];
  suggestions: string[];
}

interface ImageSEOAuditProps {
  domain: string;
  keywords?: string[];
  className?: string;
}

export function ImageSEOAudit({ domain, keywords = [], className = "" }: ImageSEOAuditProps) {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    totalImages: number;
    withAlt: number;
    withoutAlt: number;
    score: number;
    images: ImageAuditItem[];
    summary: {
      altCoverage: number;
      optimizedImages: number;
      sizeSpecified: number;
      modernFormats: number;
    };
    aiRecommendations?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // 분석 실행
  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("URL을 입력해주세요.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/dashboard/seo/image-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.startsWith("http")
            ? url
            : `https://${domain}${url.startsWith("/") ? url : `/${url}`}`,
          keywords,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults({
          totalImages: data.totalImages,
          withAlt: data.withAlt,
          withoutAlt: data.withoutAlt,
          score: data.score,
          images: data.images,
          summary: data.summary,
          aiRecommendations: data.aiRecommendations,
        });
      } else {
        setError(data.error || "분석 실패");
      }
    } catch (err) {
      setError("이미지 분석 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // 점수 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  // 프로그레스바 색상
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // alt 품질 아이콘
  const AltQualityIcon = ({ quality }: { quality: "good" | "needs_improvement" | "missing" }) => {
    switch (quality) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "needs_improvement":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case "missing":
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  // 이미지 파일명 축약
  const shortenSrc = (src: string) => {
    if (src.length <= 40) return src;
    const parts = src.split("/");
    const filename = parts[parts.length - 1];
    if (filename.length > 40) {
      return `...${filename.slice(-37)}`;
    }
    return `.../${filename}`;
  };

  return (
    <div className={`bg-[#1a1b23] rounded-lg border border-[#373A40] ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 border-b border-[#373A40]">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white">이미지 SEO 진단</h2>
        </div>
        {results && (
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}점
            </span>
          </div>
        )}
      </div>

      {/* URL 입력 */}
      <div className="p-5 border-b border-[#373A40]">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleAnalyze()}
              placeholder={`https://${domain}/page 또는 /page`}
              className="w-full pl-10 pr-4 py-2 bg-[#0d0e12] border border-[#373A40] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <button
            onClick={() => void handleAnalyze()}
            disabled={analyzing || !url.trim()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            분석
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>

      {/* 결과 */}
      {results && (
        <div className="p-5 space-y-6">
          {/* 요약 통계 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[#25262b] rounded-lg p-3 text-center">
              <FileImage className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{results.totalImages}</p>
              <p className="text-xs text-gray-500">총 이미지</p>
            </div>
            <div className="bg-[#25262b] rounded-lg p-3 text-center">
              <Tag className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-400">{results.withAlt}</p>
              <p className="text-xs text-gray-500">alt 있음</p>
            </div>
            <div className="bg-[#25262b] rounded-lg p-3 text-center">
              <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-red-400">{results.withoutAlt}</p>
              <p className="text-xs text-gray-500">alt 없음</p>
            </div>
            <div className="bg-[#25262b] rounded-lg p-3 text-center">
              <Maximize2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-blue-400">{results.summary.sizeSpecified}</p>
              <p className="text-xs text-gray-500">크기 명시</p>
            </div>
          </div>

          {/* Alt 커버리지 프로그레스 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Alt 태그 커버리지</span>
              <span className={`text-sm font-medium ${getScoreColor(results.summary.altCoverage)}`}>
                {results.summary.altCoverage}%
              </span>
            </div>
            <div className="h-2 bg-[#25262b] rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(results.summary.altCoverage)} transition-all duration-500`}
                style={{ width: `${results.summary.altCoverage}%` }}
              />
            </div>
          </div>

          {/* AI 추천 */}
          {results.aiRecommendations && results.aiRecommendations.length > 0 && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI 추천
              </h3>
              <ul className="space-y-2">
                {results.aiRecommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 이미지 목록 */}
          {results.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">
                이미지 상세 ({results.images.length}개)
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {results.images.map((img, idx) => (
                  <div key={idx} className="border border-[#373A40] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedImage(expandedImage === img.src ? null : img.src)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#25262b] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <AltQualityIcon quality={img.altQuality} />
                        <span className="text-sm text-white truncate">{shortenSrc(img.src)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {img.issues.length > 0 && (
                          <span className="text-xs text-red-400">{img.issues.length}개 이슈</span>
                        )}
                        {expandedImage === img.src ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedImage === img.src && (
                      <div className="border-t border-[#373A40] p-3 bg-[#25262b]/50 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Alt: </span>
                            <span className={img.hasAlt && img.alt ? "text-white" : "text-red-400"}>
                              {img.alt || "(없음)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">포맷: </span>
                            <span
                              className={img.isOptimized ? "text-emerald-400" : "text-amber-400"}
                            >
                              {img.fileType?.toUpperCase() || "알 수 없음"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">크기: </span>
                            <span className="text-white">
                              {img.hasExplicitSize ? `${img.width}x${img.height}` : "미지정"}
                            </span>
                          </div>
                        </div>

                        {img.issues.length > 0 && (
                          <div className="pt-2 border-t border-[#373A40]">
                            <p className="text-xs text-red-400 mb-1">이슈:</p>
                            <ul className="space-y-1">
                              {img.issues.map((issue, i) => (
                                <li key={i} className="text-xs text-gray-400">
                                  • {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {img.suggestions.length > 0 && (
                          <div className="pt-2 border-t border-[#373A40]">
                            <p className="text-xs text-blue-400 mb-1">제안:</p>
                            <ul className="space-y-1">
                              {img.suggestions.map((sug, i) => (
                                <li key={i} className="text-xs text-gray-400">
                                  • {sug}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <a
                          href={img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          이미지 보기
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 가이드 (결과 없을 때) */}
      {!results && !analyzing && (
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-400 text-center">
            URL을 입력하면 페이지 내 이미지의 SEO 상태를 진단합니다.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#25262b] rounded-lg">
              <Tag className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">Alt 태그</p>
              <p className="text-xs text-gray-500">이미지 설명 텍스트 검사</p>
            </div>
            <div className="p-3 bg-[#25262b] rounded-lg">
              <FileImage className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">이미지 포맷</p>
              <p className="text-xs text-gray-500">WebP 등 최적화 포맷 확인</p>
            </div>
            <div className="p-3 bg-[#25262b] rounded-lg">
              <Maximize2 className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-white">크기 명시</p>
              <p className="text-xs text-gray-500">CLS 방지 여부 확인</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageSEOAudit;
