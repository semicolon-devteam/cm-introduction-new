export function Footer() {
  return (
    <footer className="bg-brand-surface text-brand-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About & Vision */}
          <div className="space-y-4">
            <h3 className="text-heading-3 font-bold mb-4">Semicolon</h3>
            <p className="text-body-2 text-gray-light leading-relaxed">
              당신의 커뮤니티; 우리의 솔루션;
            </p>
            <p className="text-caption text-gray-medium font-medium tracking-wide">
              Start; Communicate;
            </p>
          </div>

          {/* Column 2: Core Values */}
          <div className="space-y-4">
            <h4 className="text-body-1 font-bold mb-4">Core Values</h4>
            <ul className="space-y-3 text-body-2 text-gray-light">
              <li className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span>AI 친화</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span>압도적 속도</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg">🔨</span>
                <span>과감한 혁신</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="text-body-1 font-bold mb-4">Contact</h4>
            <div className="space-y-3 text-body-2 text-gray-light">
              <div className="flex flex-col gap-1">
                <span className="text-caption text-gray-medium">Email</span>
                <a
                  href="mailto:dev@team-semicolon.com"
                  className="hover:text-brand-primary transition-colors"
                >
                  dev@team-semicolon.com
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-caption text-gray-medium">GitHub</span>
                <a
                  href="https://github.com/semicolon-devteam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition-colors"
                >
                  github.com/semicolon-devteam
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-medium/20 pt-8">
          <p className="text-caption text-gray-medium text-center">
            © 2025 Semicolon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
