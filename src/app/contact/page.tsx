import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

import { ContactForm } from "./_components/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141622] to-[#000000]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-heading-2 md:text-heading-1 font-bold text-brand-white mb-6">
              프로젝트
              <br />
              상담이 필요하신가요?
            </h1>
            <p className="text-body-1 text-gray-light">
              세미콜론 팀이 여러분의 성공을 위해 함께하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <ContactForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
