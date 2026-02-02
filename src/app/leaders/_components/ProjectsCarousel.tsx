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

interface ProjectsCarouselProps {
  projects: Project[];
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < projects.length - visibleCount) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleProjectClick = (index: number) => {
    setSelectedIndex(index);
  };

  if (!projects || projects.length === 0) {
    return <p className="text-gray-light text-sm">등록된 프로젝트가 없습니다.</p>;
  }

  const selectedProject = projects[selectedIndex];
  const visibleProjects = projects.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="space-y-4">
      {/* Projects Image Grid */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-3">
          {visibleProjects.map((project, index) => {
            const actualIndex = startIndex + index;
            const isSelected = actualIndex === selectedIndex;

            return (
              <button
                key={actualIndex}
                onClick={() => handleProjectClick(actualIndex)}
                className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-all duration-200 bg-black ${
                  isSelected ? "ring-2 ring-brand-primary" : "hover:opacity-80"
                }`}
              >
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center">
                    <span className="text-brand-primary text-xs text-center px-2">
                      {project.name}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {projects.length > visibleCount && (
          <>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                startIndex === 0
                  ? "bg-black/30 cursor-not-allowed"
                  : "bg-black/60 hover:bg-black/80"
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= projects.length - visibleCount}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                startIndex >= projects.length - visibleCount
                  ? "bg-black/30 cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-primary/80"
              }`}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Selected Project Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white font-bold">{selectedProject.name}</span>
          <span className="text-gray-light">|</span>
          <span className="text-gray-light text-sm">{selectedProject.year}</span>
          {selectedProject.link && (
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto hover:text-brand-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-light" />
            </a>
          )}
        </div>
        <p className="text-gray-light text-sm leading-relaxed mb-4">
          {selectedProject.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedProject.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="text-xs px-3 py-1 rounded-full"
              style={{ color: "#068FFF", border: "1px solid #068FFF" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
