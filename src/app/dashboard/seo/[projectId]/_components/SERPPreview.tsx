"use client";

import React, { useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  Star,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface SERPPreviewData {
  url: string;
  title: string;
  description: string;
  favicon?: string;
  structuredData?: {
    type: string;
    name?: string;
    rating?: { value: number; count: number };
    price?: string;
    availability?: string;
    breadcrumbs?: string[];
  };
  ogImage?: string;
  publishedDate?: string;
  author?: string;
  issues: {
    type: "error" | "warning" | "info";
    message: string;
    field: string;
  }[];
}

interface SERPPreviewProps {
  domain: string;
}

export function SERPPreview({ domain }: SERPPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SERPPreviewData | null>(null);
  const [customUrl, setCustomUrl] = useState("");

  const handleCheck = async (url?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/seo/serp-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url || customUrl || domain }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        alert(`오류: ${data.error}`);
      }
    } catch {
      alert("SERP 미리보기 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getIssueBgColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500/10 border-red-500/30";
      case "warning":
        return "bg-amber-500/10 border-amber-500/30";
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const truncateText = (text: string, maxLen: number) => {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + "...";
  };

  // 별점 렌더링
  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<Star key={i} className="w-3 h-3 fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-3 h-3 text-[#5c5f66]" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-medium">SERP 미리보기</h3>
          <span className="text-xs text-[#5c5f66]">Google 검색 결과</span>
        </div>
      </div>

      {/* URL 입력 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder={`https://${domain}/페이지-경로`}
          className="flex-1 px-3 py-2 text-sm bg-[#25262b] border border-[#373A40] rounded text-white placeholder-[#5c5f66] focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => void handleCheck()}
          disabled={loading}
          className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          미리보기
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Google 검색 결과 미리보기 */}
          <div className="p-4 bg-white rounded-lg">
            <p className="text-xs text-[#5c5f66] mb-3 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Google 검색 결과 미리보기
            </p>

            {/* 일반 검색 결과 */}
            <div className="mb-4">
              {/* URL & Favicon */}
              <div className="flex items-center gap-2 mb-1">
                {result.favicon && (
                  <Image
                    src={result.favicon}
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded"
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span className="text-xs text-[#202124]">{new URL(result.url).hostname}</span>
                <span className="text-xs text-[#5f6368]">
                  › {new URL(result.url).pathname.slice(1) || "홈"}
                </span>
              </div>

              {/* 제목 */}
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#1a0dab] hover:underline block mb-1"
              >
                {truncateText(result.title, 60)}
              </a>

              {/* 구조화 데이터: 별점 */}
              {result.structuredData?.rating && (
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex">{renderStars(result.structuredData.rating.value)}</div>
                  <span className="text-xs text-[#70757a]">
                    {result.structuredData.rating.value.toFixed(1)} (
                    {result.structuredData.rating.count.toLocaleString()}개 리뷰)
                  </span>
                </div>
              )}

              {/* 구조화 데이터: 가격 */}
              {result.structuredData?.price && (
                <div className="text-sm text-[#202124] mb-1">
                  {result.structuredData.price}
                  {result.structuredData.availability && (
                    <span className="text-[#70757a]">
                      {" "}
                      · {result.structuredData.availability === "InStock" ? "재고 있음" : "품절"}
                    </span>
                  )}
                </div>
              )}

              {/* 설명 */}
              <p className="text-sm text-[#4d5156] leading-relaxed">
                {result.publishedDate && (
                  <span className="text-[#70757a]">
                    {new Date(result.publishedDate).toLocaleDateString("ko-KR")} —{" "}
                  </span>
                )}
                {truncateText(result.description, 160)}
              </p>

              {/* 브레드크럼 */}
              {result.structuredData?.breadcrumbs && (
                <div className="flex items-center gap-1 mt-1 text-xs text-[#70757a]">
                  {result.structuredData.breadcrumbs.map((crumb, idx) => (
                    <span key={idx}>
                      {idx > 0 && " › "}
                      {crumb}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* OG 이미지 미리보기 */}
            {result.ogImage && (
              <div className="border-t border-[#e8eaed] pt-3 mt-3">
                <p className="text-xs text-[#70757a] mb-2">소셜 미리보기 이미지</p>
                <Image
                  src={result.ogImage}
                  alt="OG Image"
                  width={300}
                  height={128}
                  className="max-h-32 rounded object-cover"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* 메타 정보 상세 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#25262b] rounded-lg">
              <p className="text-xs text-[#909296] mb-1">타이틀 길이</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{result.title.length}자</span>
                <span
                  className={`text-xs ${
                    result.title.length >= 30 && result.title.length <= 60
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {result.title.length >= 30 && result.title.length <= 60
                    ? "적절함"
                    : result.title.length < 30
                      ? "짧음"
                      : "김"}
                </span>
              </div>
              <div className="h-1 bg-[#373A40] rounded mt-2">
                <div
                  className={`h-full rounded ${
                    result.title.length >= 30 && result.title.length <= 60
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min((result.title.length / 60) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-[#25262b] rounded-lg">
              <p className="text-xs text-[#909296] mb-1">설명 길이</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">{result.description.length}자</span>
                <span
                  className={`text-xs ${
                    result.description.length >= 70 && result.description.length <= 160
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {result.description.length >= 70 && result.description.length <= 160
                    ? "적절함"
                    : result.description.length < 70
                      ? "짧음"
                      : "김"}
                </span>
              </div>
              <div className="h-1 bg-[#373A40] rounded mt-2">
                <div
                  className={`h-full rounded ${
                    result.description.length >= 70 && result.description.length <= 160
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{
                    width: `${Math.min((result.description.length / 160) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* 이슈 목록 */}
          {result.issues.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-[#909296] font-medium">검출된 이슈</p>
              {result.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded border ${getIssueBgColor(issue.type)}`}
                >
                  {getIssueIcon(issue.type)}
                  <span className="text-xs text-white">{issue.message}</span>
                  <span className="text-xs text-[#5c5f66]">({issue.field})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">
                모든 SEO 요소가 적절하게 설정되어 있습니다
              </span>
            </div>
          )}

          {/* 구조화 데이터 타입 */}
          {result.structuredData && (
            <div className="p-3 bg-[#25262b] rounded-lg">
              <p className="text-xs text-[#909296] mb-2">구조화 데이터</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                  {result.structuredData.type}
                </span>
                {result.structuredData.name && (
                  <span className="text-xs text-white">{result.structuredData.name}</span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-[#5c5f66]">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Google 검색 결과에 표시될 모습을 미리 확인합니다</p>
          <p className="text-xs mt-1">타이틀, 설명, 리치 스니펫을 최적화하세요</p>
        </div>
      )}
    </div>
  );
}
