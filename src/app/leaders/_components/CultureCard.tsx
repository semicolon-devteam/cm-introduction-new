"use client";

import type { LucideIcon } from "lucide-react";

interface CultureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}

export function CultureCard({
  icon: Icon,
  title,
  description,
  delay,
  isVisible,
}: CultureCardProps) {
  return (
    <div
      className={`bg-[#1a1f2e] rounded-2xl p-8 text-center opacity-0 translate-y-6 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0a1628] border border-[#068FFF]/30 flex items-center justify-center">
        <Icon size={28} className="text-[#068FFF]" />
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{description}</p>
    </div>
  );
}
