/**
 * 로그인 페이지
 * Development Philosophy:
 * - Server Component for SSR
 * - Domain-driven structure with _components
 * - Redirect logic separation
 */

import { redirect } from 'next/navigation';

import { LoginForm } from '@organisms/LoginForm';
import { createServerSupabaseClient } from '@lib/supabase/server';

import { AuthLayout } from '../_components';

export default async function LoginPage() {
  // 서버에서 인증 상태 확인
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout
      title="로그인"
      description="계정에 로그인하여 서비스를 이용하세요"
    >
      <LoginForm />
    </AuthLayout>
  );
}
