"use client";

import Link from "next/link";
import { ChartNoAxesCombined, Settings, Plus } from "lucide-react";
import { SEOProjectCard, SEOProjectCardSkeleton } from "./SEOProjectCard";
import { getAllProjects } from "../_config/seo-projects";

export function SEOProjectsSection() {
  const projects = getAllProjects();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartNoAxesCombined className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">SEO 프로젝트</h2>
          <span className="text-xs text-gray-500 bg-[#25262b] px-2 py-0.5 rounded-full">
            {projects.length}개 프로젝트
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/seo/settings"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-[#25262b]"
          >
            <Settings className="w-4 h-4" />
            설정
          </Link>
          <Link
            href="/dashboard/seo/add"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            프로젝트 추가
          </Link>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <SEOProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty state if no projects */}
      {projects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#373A40] rounded-xl">
          <ChartNoAxesCombined className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">아직 등록된 SEO 프로젝트가 없습니다</p>
          <Link
            href="/dashboard/seo/add"
            className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />첫 프로젝트 추가하기
          </Link>
        </div>
      )}
    </div>
  );
}

export function SEOProjectsSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#25262b] rounded animate-pulse" />
        <div className="h-6 w-32 bg-[#25262b] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SEOProjectCardSkeleton />
        <SEOProjectCardSkeleton />
        <SEOProjectCardSkeleton />
      </div>
    </div>
  );
}
