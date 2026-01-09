"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Leader {
  id: string;
  slug: string;
  name: string;
  nickname: string;
  profileImage: string;
  skills: string[];
}

interface OtherLeadersCarouselProps {
  leaders: Leader[];
}

export function OtherLeadersCarousel({ leaders }: OtherLeadersCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < leaders.length - visibleCount) {
      setStartIndex(startIndex + 1);
    }
  };

  if (!leaders || leaders.length === 0) {
    return null;
  }

  const visibleLeaders = leaders.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative">
      {/* Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {visibleLeaders.map((leader) => (
          <Link key={leader.id} href={`/leaders/${leader.slug}`} className="group">
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#0D0E16" }}>
              {/* Profile Image */}
              <div className="relative aspect-square bg-brand-surface">
                {leader.profileImage ? (
                  <Image
                    src={leader.profileImage}
                    alt={`${leader.name} profile`}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                    <span className="text-4xl text-gray-light">{leader.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-white">{leader.name}</span>
                  <span className="text-sm text-gray-light">{leader.nickname}</span>
                  <ExternalLink className="w-4 h-4 text-gray-light ml-auto" />
                </div>
                <div className="space-y-1">
                  {leader.skills.slice(0, 2).map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-xs text-gray-light">
                      <span className="text-brand-primary">○</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Buttons */}
      {leaders.length > visibleCount && (
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
              startIndex === 0
                ? "border-white/20 text-white/30 cursor-not-allowed"
                : "border-white/30 text-white hover:border-white/50"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex >= leaders.length - visibleCount}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
              startIndex >= leaders.length - visibleCount
                ? "border-white/20 text-white/30 cursor-not-allowed"
                : "border-white/30 text-white hover:border-white/50"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
