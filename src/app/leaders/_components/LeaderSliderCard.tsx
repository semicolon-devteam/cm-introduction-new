"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface LeaderSliderCardProps {
  name: string;
  nickname: string;
  image: string;
  roles: string[];
  delay: number;
  isVisible: boolean;
}

export function LeaderSliderCard({
  name,
  nickname,
  image,
  roles,
  delay,
  isVisible,
}: LeaderSliderCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[260px] opacity-0 translate-y-8 transition-all duration-700 ease-out cursor-pointer
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 mb-3">
        {!imageError && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover z-10"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-4xl text-gray-600">{name[0]}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{name}</span>
          <span className="text-sm text-gray-500">| {nickname}</span>
        </div>
        <ArrowRight size={20} className="text-[#068FFF]" />
      </div>
      <div className="space-y-1">
        {roles.map((role, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            {role}
          </div>
        ))}
      </div>
    </div>
  );
}
