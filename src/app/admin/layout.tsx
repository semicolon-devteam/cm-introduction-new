import { ReactNode } from "react";
import Link from "next/link";

// 모든 admin 페이지는 동적 렌더링 (React Query 사용)
export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg">Admin</span>
            <nav className="flex gap-4">
              <Link
                href="/admin/semo-stats"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                SEMO 통계
              </Link>
              <Link
                href="/admin/leaders"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                리더 관리
              </Link>
              <Link
                href="/admin/part-timers"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                파트타이머 관리
              </Link>
              <Link
                href="/admin/contacts"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                문의 관리
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 메인으로
          </Link>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
