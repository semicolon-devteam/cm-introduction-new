import { redirect } from "next/navigation";

/**
 * SEO 대시보드는 메인 대시보드로 통합됨
 * 기존 링크 호환성을 위해 리다이렉트 유지
 */
export default function SEODashboardPage() {
  redirect("/dashboard");
}
