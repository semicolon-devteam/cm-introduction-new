export function JourneySection() {
  const journeyData = [
    {
      year: "2024",
      items: [
        {
          title: "세미콜론 설립",
          desc: "5명의 공동 창업자가 모여\n커뮤니티 기술의 미래를 그리다",
        },
        {
          title: "첫 프로젝트 수주",
          desc: "A 대학교 커뮤니티 플랫폼 구축으로\n10만 사용자 확보 경험",
        },
      ],
    },
    {
      year: "2025",
      items: [
        {
          title: "팀 확장",
          desc: "파트타임 전문가 6명 합류,\n다양한 분야의 역량 강화",
        },
        {
          title: "기술 혁신",
          desc: "AI 기반 추천 시스템 개발로\n고객사 매출 35% 증가 달성",
        },
      ],
    },
    {
      year: "2026",
      items: [
        {
          title: "성장과 확장",
          desc: "다양한 산업군의 파트너들과 함께\n지속적인 성장",
        },
      ],
    },
  ];

  return (
    <section className="py-24 px-6 border-b border-white/10">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-brand-primary text-sm tracking-widest mb-4">Our Journey</p>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">함께 걸어온 길</h2>
          <p className="text-gray-light text-sm">세미콜론의 성자 이야기를 연도별로 만나보세요</p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 max-w-xl mx-auto">
          {journeyData.map((yearGroup, yearIndex) => (
            <div key={yearIndex} className="mb-8 last:mb-0">
              {/* Year with dot */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-brand-primary font-medium">{yearGroup.year}</span>
              </div>

              {/* Items for this year */}
              <div className="ml-1 pl-6 border-l border-white/10 space-y-6">
                {yearGroup.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <h3 className="text-lg font-bold text-brand-white mb-2">· {item.title}</h3>
                    <p className="text-sm text-gray-light whitespace-pre-line">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
