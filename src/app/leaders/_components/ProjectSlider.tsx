"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Project {
  year: string;
  name: string;
  tags: string[];
  description: string;
  thumbnail?: string;
  link?: string;
}

interface ProjectSliderProps {
  projects: Project[];
  delay?: number;
  isVisible?: boolean;
}

export function ProjectSlider({ projects, delay = 0, isVisible = true }: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects || projects.length === 0) {
    return <p className="text-gray-400 text-sm">등록된 프로젝트가 없습니다.</p>;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(projects.length - 1, prev + 1));
  };

  // Always show 3 items when possible
  let startIndex = Math.max(0, activeIndex - 1);
  let endIndex = startIndex + 3;
  if (endIndex > projects.length) {
    endIndex = projects.length;
    startIndex = Math.max(0, endIndex - 3);
  }
  const visibleProjects = projects.slice(startIndex, endIndex);

  const startOffset = startIndex;
  const activeProject = projects[activeIndex];

  return (
    <div
      className={`flex flex-col h-full opacity-0 transition-all duration-700 ease-out ${isVisible ? "opacity-100" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image Carousel - 12px gap between items, 2:1:1 ratio */}
      <div className="relative flex-1 min-h-0">
        <div className="flex gap-3 items-stretch h-full min-w-0">
          {visibleProjects.map((project, idx) => {
            const actualIndex = startOffset + idx;
            const isActive = actualIndex === activeIndex;

            return (
              <button
                key={actualIndex}
                onClick={() => setActiveIndex(actualIndex)}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 h-full ${
                  isActive ? "flex-[2] border-2 border-[#068FFF]" : "flex-1"
                }`}
              >
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    className={`object-cover transition-all duration-300 ${
                      isActive ? "" : "blur-[2px] brightness-50"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-[#1a1a2e] flex items-center justify-center transition-all duration-300 ${
                      isActive ? "border border-[#068FFF]/30" : "blur-[2px] brightness-50"
                    }`}
                  >
                    <span
                      className={`text-sm text-center px-2 ${
                        isActive ? "text-[#068FFF]" : "text-[#068FFF]/50"
                      }`}
                    >
                      {project.name}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons - 3개 미만일 때 숨김 */}
        {projects.length >= 3 && (
          <>
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
                activeIndex === 0
                  ? "bg-gray-800/50 cursor-not-allowed"
                  : "bg-gray-800/80 hover:bg-gray-700"
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === projects.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 ${
                activeIndex === projects.length - 1
                  ? "bg-gray-800/50 cursor-not-allowed"
                  : "bg-[#068FFF] hover:bg-[#068FFF]/80"
              }`}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Active Project Info - 12px gap from image */}
      <div className="mt-3">
        {/* Project Name | Year */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">{activeProject.name}</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 text-sm">{activeProject.year}</span>
          {activeProject.link && (
            <a
              href={activeProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hover:text-[#068FFF] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          )}
        </div>
        {/* Description - 8px gap from title, fixed 2-line height */}
        <p className="text-gray-400 text-sm leading-relaxed mt-2 line-clamp-2 min-h-[40px]">
          {activeProject.description}
        </p>
        {/* Tags - 12px gap from description */}
        <div className="flex flex-wrap gap-2 mt-3">
          {activeProject.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="text-xs px-3 py-1 rounded-full text-[#068FFF] border border-[#068FFF]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
