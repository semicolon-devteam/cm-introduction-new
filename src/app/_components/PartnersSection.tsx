import Image from "next/image";
import { UsersRound } from "lucide-react";

export function PartnersSection() {
  const partners = [
    { name: "정치판", logo: "/images/partners/정치판.png" },
    { name: "코인톡", logo: "/images/partners/코인톡.png" },
    { name: "MAJU", logo: "/images/partners/MAJU.jpg" },
    { name: "매출지킴이", logo: "/images/partners/매출지킴이.png" },
    { name: "차곡", logo: "/images/partners/차곡.png" },
    { name: "현장관리 앱", logo: null },
  ];

  return (
    <section className="py-24 px-6 border-b border-white/10">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
            함께하는 프로젝트
          </h2>
          <p className="text-gray-light text-sm">세미콜론이 함께한 프로젝트들입니다</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-3 overflow-hidden">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <UsersRound className="w-6 h-6 text-brand-primary" />
                )}
              </div>
              <span className="text-xs text-gray-light">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
