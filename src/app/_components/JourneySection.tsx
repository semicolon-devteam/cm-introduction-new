export function JourneySection() {
  const journeyItems = [
    {
      year: "2023",
      title: "세미콜론 설립",
      desc: "새로운 꿈을 향한리가 모여 커뮤니티 기술의 미래를 그리다",
      align: "left",
    },
    {
      year: "2023",
      title: "첫 프로젝트 수주",
      desc: "A 대학교 커뮤니티 플랫폼 구축으로 50만 사용자 확보",
      align: "right",
    },
    {
      year: "2024",
      title: "팀 확장",
      desc: "개발자와 전문가 대폭 영입, 다양한 분야와 직종 숙련",
      align: "left",
    },
    {
      year: "2024",
      title: "기술 혁신",
      desc: "AI 기반 추천 시스템 개발로 고객사 매출 30% 증가 달성",
      align: "right",
    },
    {
      year: "2025",
      title: "50+ 고객사 돌파",
      desc: "다양한 산업영역의 50개 이상 고객사와 협력 성공",
      align: "left",
    },
  ];

  return (
    <section className="py-24 px-6 border-b border-white/10">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand-primary text-sm tracking-widest mb-4 italic">Our Journey</p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">함께 걸어온 길</h2>
          <p className="text-gray-light text-sm">세미콜론의 성장 이야기를 연도별로 만나보세요</p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-primary/30 transform -translate-x-1/2" />

          {/* Timeline Items */}
          {journeyItems.map((item, index) => (
            <div key={index} className="relative flex items-center mb-12 last:mb-0">
              {/* Year Badge */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <span className="text-brand-primary text-sm font-medium">{item.year}</span>
              </div>

              {/* Content Card */}
              <div className={`w-5/12 ${item.align === "left" ? "pr-8" : "ml-auto pl-8"}`}>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-brand-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-light">{item.desc}</p>
                </div>
              </div>

              {/* Dot */}
              <div className="absolute left-1/2 top-8 w-2 h-2 rounded-full bg-brand-primary transform -translate-x-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
