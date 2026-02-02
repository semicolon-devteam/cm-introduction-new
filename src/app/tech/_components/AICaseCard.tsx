"use client";

import type { LucideIcon } from "lucide-react";

interface AICaseCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  delay: number;
  isVisible: boolean;
}

export function AICaseCard({
  icon: Icon,
  title,
  description,
  badge,
  delay,
  isVisible,
}: AICaseCardProps) {
  return (
    <div
      className={`p-6 bg-[#1E1E1E] border border-gray-700/50 rounded-2xl
        opacity-0 translate-y-8 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#068FFF]/20 flex items-center justify-center">
          <Icon size={20} className="text-[#068FFF]" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <span className="inline-block px-4 py-2 bg-[#068FFF]/20 text-[#068FFF] text-sm font-medium rounded-full border border-[#068FFF]/30">
        {badge}
      </span>
    </div>
  );
}
