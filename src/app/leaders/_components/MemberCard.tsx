"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";

interface MemberCardProps {
  nickname: string;
  role: string;
  company: string;
  experience: string;
  delay: number;
  isVisible: boolean;
}

export function MemberCard({
  nickname,
  role,
  company,
  experience,
  delay,
  isVisible,
}: MemberCardProps) {
  return (
    <div
      className={`relative rounded-xl p-5 overflow-hidden opacity-0 translate-y-6 transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0">
        <Image src="/images/members/member-card-bg.png" alt="" fill className="object-cover" />
      </div>
      <div className="relative z-10">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-white tracking-wide">{nickname}</span>
          <span className="text-sm text-gray-500">| {role}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Building2 size={14} />
          <span>{company}</span>
        </div>
        <span className="text-[#068FFF] text-sm">{experience}</span>
      </div>
    </div>
  );
}
