import { Header } from "@/components/organisms/Header";
import { HeroSection } from "@/components/organisms/HeroSection";
import { ValueSection } from "@/components/organisms/ValueSection";
import { LeadersSection } from "@/components/organisms/LeadersSection";
import { CoreValuesSection } from "@/components/organisms/CoreValuesSection";
import { JourneySection } from "@/components/organisms/JourneySection";
import { ResultSection } from "@/components/organisms/ResultSection";
import { PartnersSection } from "@/components/organisms/PartnersSection";
import { Footer } from "@/components/organisms/Footer";

import { StatsSection, PartnersSection, JourneySection } from "./_components";
import { HomeLeadersSection } from "./_components/HomeLeadersSection";

export default function HomePage() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-black">
      {/* 고정 헤더 */}
      <Header />

      {/* 히어로 섹션 (첫 번째 화면) */}
      <HeroSection />

      {/* 가치 제안 섹션 (두 번째 화면) */}
      <ValueSection />

      {/* 리더 섹션 (세 번째 화면) */}
      <LeadersSection />

      {/* 핵심 가치 섹션 (네 번째 화면) */}
      <CoreValuesSection />

      {/* 연혁 섹션 (다섯 번째 화면) */}
      <JourneySection />

      {/* 성과 섹션 (여섯 번째 화면) */}
      <ResultSection />

      {/* 파트너 섹션 (일곱 번째 화면) */}
      <PartnersSection />

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
