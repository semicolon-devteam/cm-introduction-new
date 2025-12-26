export function Footer() {
  return (
    <footer className="bg-brand-surface text-brand-white py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col gap-6">
          {/* Company Name */}
          <div className="text-heading-3 font-bold">Semicolon</div>

          {/* Description */}
          <p className="text-body-2 text-gray-light max-w-2xl">
            연결과 소통의 가치를 실현하는 개발 팀입니다.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-2 text-caption text-gray-light">
            <div>Email: dev@team-semicolon.com</div>
            <div>© 2025 Semicolon. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
