"use client";

import { useState } from "react";
import Image from "next/image";
import { UsersRound } from "lucide-react";

export function PartnersSection() {
  const [isPaused, setIsPaused] = useState(false);

  const partners = [
    { name: "정치판", logo: "/images/partners/정치판.png" },
    { name: "코인톡", logo: "/images/partners/코인톡.png" },
    { name: "MAJU", logo: "/images/partners/MAJU.jpg" },
    { name: "매출지킴이", logo: "/images/partners/매출지킴이.png" },
    { name: "차곡", logo: "/images/partners/차곡.png" },
    { name: "현장관리 앱", logo: null },
  ];

  // 무한 스크롤을 위해 파트너 목록을 복제
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-24 px-6 border-b border-white/10 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
            함께하는 프로젝트
          </h2>
          <p className="text-gray-light text-sm whitespace-pre-line">
            {"세미콜론이 함께한\n프로젝트들입니다"}
          </p>
        </div>

        {/* Marquee Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex gap-4"
            style={{
              animationName: "partners-marquee",
              animationDuration: "20s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPaused ? "paused" : "running",
              width: "fit-content",
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center p-4 md:p-6 rounded-lg bg-white/5 border border-white/10"
                style={{ width: "calc(33.333vw - 24px)", maxWidth: "160px", minWidth: "100px" }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 flex items-center justify-center mb-2 md:mb-3 overflow-hidden">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <UsersRound className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" />
                  )}
                </div>
                <span className="text-xs text-gray-light text-center">{partner.name}</span>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes partners-marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
