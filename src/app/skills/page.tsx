import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

import {
  HeroSection,
  AICasesSection,
  LeadershipSection,
  CompetitivenessSection,
  SpecialOfferSection,
  ContactSection,
} from "./_components";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <HeroSection />
      <AICasesSection />
      <LeadershipSection />
      <CompetitivenessSection />
      <SpecialOfferSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
