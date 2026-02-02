"use client";

import type { LucideIcon } from "lucide-react";

interface TechCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  delay: number;
  isVisible: boolean;
}

export function TechCard({
  icon: Icon,
  title,
  description,
  badge,
  delay,
  isVisible,
}: TechCardProps) {
  return (
    <div
      className={`p-6 bg-[#1E1E1E] border border-gray-700/50 rounded-2xl
        opacity-0 translate-y-8 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Icon size={20} className="text-[#068FFF]" />
            <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <span className="flex-shrink-0 px-4 py-2 bg-[#068FFF]/20 text-[#068FFF] text-sm font-medium rounded-full border border-[#068FFF]/30 whitespace-nowrap">
          {badge}
        </span>
      </div>
    </div>
  );
}
