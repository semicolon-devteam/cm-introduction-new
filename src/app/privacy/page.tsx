import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

export const metadata: Metadata = {
  title: "개인정보 처리방침 - Semicolon",
  description: "Semicolon 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-[800px] mx-auto px-6 py-32">
        <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>
        <p className="text-gray-400 text-sm mb-12">시행일: 2026년 2월 13일</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. 개인정보의 처리 목적</h2>
            <p>
              Semicolon(이하 &quot;회사&quot;)은 다음의 목적을 위해 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>홈페이지 문의 접수 및 응대</li>
              <li>서비스 제공 및 운영</li>
              <li>웹사이트 이용 통계 분석 (Google Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. 수집하는 개인정보 항목</h2>
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>문의 접수 시: 이름, 이메일, 문의 내용</li>
              <li>자동 수집 항목: 접속 IP, 브라우저 종류, 방문 일시, 서비스 이용 기록, 쿠키</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>문의 기록: 3년 (전자상거래 등에서의 소비자 보호에 관한 법률)</li>
              <li>웹사이트 방문 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 이용자의 동의가 있거나 법령에 의해 요구되는 경우에는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. 개인정보의 처리 위탁</h2>
            <p>회사는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>Google LLC — 웹사이트 이용 통계 분석 (Google Analytics)</li>
              <li>Vercel Inc. — 웹사이트 호스팅</li>
              <li>Supabase Inc. — 데이터베이스 운영</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. 정보주체의 권리·의무</h2>
            <p>
              이용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제, 처리정지를 요구할 수 있습니다.
              요청은 아래 연락처로 문의해 주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. 쿠키의 사용</h2>
            <p>
              회사는 웹사이트 이용 통계 수집을 위해 쿠키를 사용합니다.
              이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며,
              이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. 개인정보의 안전성 확보 조치</h2>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-400">
              <li>개인정보의 암호화</li>
              <li>접근 권한 관리</li>
              <li>보안 프로그램 설치 및 갱신</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. 개인정보 보호책임자</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>담당자: Semicolon 개발팀</li>
              <li>이메일: <a href="mailto:roki@semi-colon.space" className="text-[#068FFF] hover:underline">roki@semi-colon.space</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. 개인정보 처리방침 변경</h2>
            <p>
              이 개인정보 처리방침은 2026년 2월 13일부터 적용되며,
              변경사항이 있는 경우 웹사이트를 통해 공지합니다.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <Link href="/terms" className="text-[#068FFF] hover:underline text-sm">
            이용약관 보기 →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
