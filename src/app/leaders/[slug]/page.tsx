import { notFound } from "next/navigation";

import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { getLeaderBySlug } from "@/data/leaders";
import { LeaderDetailSection, OtherLeadersSection, ContactSection } from "../_components";

interface LeaderPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LeaderPage({ params }: LeaderPageProps) {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);

  if (!leader) {
    notFound();
  }

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />
      <LeaderDetailSection leader={leader} />
      <OtherLeadersSection currentSlug={slug} />
      <ContactSection />
      <Footer />
    </div>
  );
}
