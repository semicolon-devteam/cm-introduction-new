import { Building2, ShoppingCart, Factory, GraduationCap, Rocket, UsersRound } from "lucide-react";

export function PartnersSection() {
  const partners = [
    { name: "A 스타트업", icon: Building2 },
    { name: "C 커머스", icon: ShoppingCart },
    { name: "D 기업", icon: Factory },
    { name: "A 대학교", icon: GraduationCap },
    { name: "B 스타트업", icon: Rocket },
    { name: "C 커뮤니티", icon: UsersRound },
  ];

  return (
    <section className="py-24 px-6 border-b border-white/10">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
            함께하는 파트너들
          </h2>
          <p className="text-gray-light text-sm">세미콜론은 다양한 파트너들과 함께합니다</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {partners.map((partner, index) => {
            const IconComponent = partner.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center p-6 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                  <IconComponent className="w-6 h-6 text-brand-primary" />
                </div>
                <span className="text-xs text-gray-light">{partner.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
