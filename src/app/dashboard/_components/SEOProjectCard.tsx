"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  BarChart3,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { SEOSite } from "../_lib/seo-sites";

interface SEOProjectCardProps {
  project: SEOSite;
}

interface SearchConsoleMetric {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleResponse {
  connected: boolean;
  overview?: {
    current: SearchConsoleMetric;
    previous: SearchConsoleMetric;
  };
  error?: string;
}

export function SEOProjectCard({ project }: SEOProjectCardProps) {
  const [data, setData] = useState<SearchConsoleMetric | null>(null);
  const [previousData, setPreviousData] = useState<SearchConsoleMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scEnabled = project.searchConsole?.enabled ?? false;
  const scSiteUrl = project.searchConsole?.siteUrl ?? "";
  const gaEnabled = project.analytics?.enabled ?? false;

  useEffect(() => {
    if (!scEnabled || !scSiteUrl) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/dashboard/search-console?period=7days&siteUrl=${encodeURIComponent(scSiteUrl)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result: SearchConsoleResponse = await response.json();

        if (!result.connected || !result.overview) {
          throw new Error(result.error || "연결 실패");
        }

        setData(result.overview.current);
        setPreviousData(result.overview.previous);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [scEnabled, scSiteUrl]);

  const getTrend = (current: number, previous: number | undefined) => {
    if (!previous) return "neutral";
    const diff = ((current - previous) / previous) * 100;
    if (diff > 5) return "up";
    if (diff < -5) return "down";
    return "neutral";
  };

  const getChangePercent = (current: number, previous: number | undefined) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
    if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const isActive = scEnabled || gaEnabled;

  return (
    <div
      className="relative rounded-xl border border-[#373A40] bg-[#1a1b23] p-4 hover:border-[#4a4d55] transition-colors"
      style={{ borderLeftColor: project.color ?? "#3B82F6", borderLeftWidth: "3px" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{project.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{project.name}</h3>
            <p className="text-xs text-gray-500">{project.domain}</p>
          </div>
        </div>
        {isActive && (
          <Link
            href={`/dashboard/seo/${project.id}`}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mb-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
            scEnabled ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-500"
          }`}
        >
          <Search className="w-3 h-3" />
          Search Console
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
            gaEnabled ? "bg-orange-500/20 text-orange-400" : "bg-gray-700 text-gray-500"
          }`}
        >
          <BarChart3 className="w-3 h-3" />
          Analytics
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-sm text-red-400 py-2">{error}</div>
      ) : !isActive ? (
        <div className="text-sm text-gray-500 py-2">연동이 필요합니다</div>
      ) : data ? (
        <div className="grid grid-cols-2 gap-3">
          {/* Clicks */}
          <div>
            <p className="text-xs text-gray-500 mb-1">클릭수</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white">{data.clicks.toLocaleString()}</span>
              <TrendIcon trend={getTrend(data.clicks, previousData?.clicks)} />
            </div>
            {previousData && (
              <p className="text-xs text-gray-500">
                {getChangePercent(data.clicks, previousData.clicks) >= 0 ? "+" : ""}
                {getChangePercent(data.clicks, previousData.clicks)}%
              </p>
            )}
          </div>

          {/* Impressions */}
          <div>
            <p className="text-xs text-gray-500 mb-1">노출수</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white">
                {data.impressions.toLocaleString()}
              </span>
              <TrendIcon trend={getTrend(data.impressions, previousData?.impressions)} />
            </div>
            {previousData && (
              <p className="text-xs text-gray-500">
                {getChangePercent(data.impressions, previousData.impressions) >= 0 ? "+" : ""}
                {getChangePercent(data.impressions, previousData.impressions)}%
              </p>
            )}
          </div>

          {/* CTR */}
          <div>
            <p className="text-xs text-gray-500 mb-1">CTR</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white">{data.ctr.toFixed(1)}%</span>
              <TrendIcon trend={getTrend(data.ctr, previousData?.ctr)} />
            </div>
          </div>

          {/* Position */}
          <div>
            <p className="text-xs text-gray-500 mb-1">평균 순위</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-white">{data.position.toFixed(1)}</span>
              {/* Position: lower is better, so invert the trend */}
              <TrendIcon
                trend={
                  previousData
                    ? data.position < previousData.position
                      ? "up"
                      : data.position > previousData.position
                        ? "down"
                        : "neutral"
                    : "neutral"
                }
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer link */}
      {isActive && (
        <Link
          href={`/dashboard/seo/${project.id}`}
          className="mt-3 pt-3 border-t border-[#373A40] flex items-center justify-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          상세 보기
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );
}

export function SEOProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#373A40] bg-[#1a1b23] p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-[#25262b] rounded" />
        <div>
          <div className="h-4 w-24 bg-[#25262b] rounded mb-1" />
          <div className="h-3 w-32 bg-[#25262b] rounded" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-24 bg-[#25262b] rounded-full" />
        <div className="h-5 w-20 bg-[#25262b] rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-[#25262b] rounded" />
        <div className="h-12 bg-[#25262b] rounded" />
        <div className="h-12 bg-[#25262b] rounded" />
        <div className="h-12 bg-[#25262b] rounded" />
      </div>
    </div>
  );
}
