import { ClipboardList, Handshake, Heart, Clock } from "lucide-react";

export function StatsSection() {
  const stats = [
    { icon: ClipboardList, value: "100+", label: "완료 프로젝트" },
    { icon: Handshake, value: "50+", label: "고객사" },
    { icon: Heart, value: "99.9%", label: "만족도" },
    { icon: Clock, value: "24/7", label: "기술 지원" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-brand-primary/80 to-brand-primary/40">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
            숫자로 보는 세미콜론
          </h2>
          <p className="text-white/70 text-sm">우리의 성과를 객관적인 지표로 확인하세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="p-6 rounded-xl bg-white/10 backdrop-blur-sm text-center">
                <IconComponent className="w-8 h-8 mx-auto mb-3 text-white/80" />
                <div className="text-3xl md:text-4xl font-bold text-brand-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
