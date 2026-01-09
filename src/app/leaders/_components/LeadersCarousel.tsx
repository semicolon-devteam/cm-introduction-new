"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Leader {
  id: string;
  slug: string;
  name: string;
  nickname: string;
  profileImage: string;
  skills: string[];
}

interface LeadersCarouselProps {
  leaders: Leader[];
}

export function LeadersCarousel({ leaders }: LeadersCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!leaders || leaders.length === 0) {
    return null;
  }

  // 무한 스크롤을 위해 리더 목록을 복제
  const duplicatedLeaders = [...leaders, ...leaders];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Marquee Container */}
      <div
        className="marquee-content flex gap-6"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicatedLeaders.map((leader, index) => (
          <Link
            key={`${leader.id}-${index}`}
            href={`/leaders/${leader.slug}`}
            className="group flex-shrink-0"
            style={{ width: "calc((100vw - 120px) / 4 - 18px)", maxWidth: "280px" }}
          >
            {/* Profile Image - Grayscale */}
            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-brand-surface">
              <Image
                src={leader.profileImage}
                alt={leader.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
              />
              {/* Name overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{leader.name}</span>
                  <span className="text-sm text-gray-300">{leader.nickname}</span>
                </div>
              </div>
            </div>
            {/* Info below image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {leader.skills.slice(0, 2).map((skill, skillIndex) => (
                    <div
                      key={`${skill}-${skillIndex}`}
                      className="flex items-center gap-2 text-xs text-gray-light"
                    >
                      <span className="text-brand-primary">○</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
                <span className="text-brand-primary">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        .marquee-content {
          animation: marquee 20s linear infinite;
          width: fit-content;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
