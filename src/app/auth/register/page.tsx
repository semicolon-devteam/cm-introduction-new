/**
 * 회원가입 페이지
 * Development Philosophy:
 * - Server Component for SSR
 * - Domain-driven structure with _components
 * - Redirect logic separation
 */

import { redirect } from 'next/navigation';

import { RegisterForm } from '@organisms/RegisterForm';
import { createServerSupabaseClient } from '@lib/supabase/server';

import { AuthLayout } from '../_components';

export default async function RegisterPage() {
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
      title="회원가입"
      description="새 계정을 만들어 서비스를 시작하세요"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
