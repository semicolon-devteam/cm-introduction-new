/**
 * 대시보드 페이지
 * Development Philosophy:
 * - Server Component for SSR
 * - Domain-driven structure with _components
 * - Clean separation of concerns
 */

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@lib/supabase/server';

import {
  DashboardHeader,
  ProfileCard,
  ActivityCard,
  QuickActionsCard,
  NewsCard,
} from './_components';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // 서버 컴포넌트에서 인증 확인
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileCard
          email={user.email ?? ''}
          userId={user.id}
          createdAt={user.created_at}
        />
        <ActivityCard userId={user.id} />
        <QuickActionsCard />
      </div>

      <div className="mt-8">
        <NewsCard />
      </div>
    </div>
  );
}
