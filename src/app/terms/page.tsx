import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

export const metadata: Metadata = {
  title: "이용약관 - Semicolon",
  description: "Semicolon 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-[800px] mx-auto px-6 py-32">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>
        <p className="text-gray-400 text-sm mb-12">시행일: 2026년 2월 13일</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제1조 (목적)</h2>
            <p>
              본 약관은 Semicolon(이하 &quot;회사&quot;)이 제공하는 웹사이트 및 관련 서비스(이하 &quot;서비스&quot;)의
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제2조 (정의)</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>&quot;서비스&quot;란 회사가 제공하는 웹사이트(semi-colon.space) 및 이에 부수하는 모든 서비스를 의미합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-400">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 공지 후 효력을 발생합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제4조 (서비스의 제공)</h2>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>회사 소개 및 포트폴리오 정보 제공</li>
              <li>문의 접수 및 상담 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제5조 (서비스의 중단)</h2>
            <p>
              회사는 시스템 점검, 교체 및 고장, 통신 두절 등의 사유가 발생한 경우에는
              서비스의 제공을 일시적으로 중단할 수 있습니다.
              계획된 서비스 중단의 경우 사전에 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제6조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>타인의 정보를 도용하는 행위</li>
              <li>회사의 서비스를 이용하여 법령 또는 공서양속에 반하는 행위</li>
              <li>회사의 지적재산권을 침해하는 행위</li>
              <li>서비스의 안정적 운영을 방해하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제7조 (지적재산권)</h2>
            <p>
              서비스에 게시된 콘텐츠의 저작권 및 지적재산권은 회사에 귀속됩니다.
              이용자는 회사의 사전 동의 없이 이를 복제, 전송, 배포, 출판 등의 방법으로 이용할 수 없습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제8조 (면책조항)</h2>
            <ul className="list-decimal list-inside space-y-2 text-gray-400">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">제9조 (분쟁 해결)</h2>
            <p>
              본 약관과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 분쟁 해결을 위해 성실히 협의합니다.
              협의가 이루어지지 않을 경우 관할 법원에 소를 제기할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">부칙</h2>
            <p>본 약관은 2026년 2월 13일부터 시행됩니다.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link href="/privacy" className="text-[#068FFF] hover:underline text-sm">
            개인정보 처리방침 보기 →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
