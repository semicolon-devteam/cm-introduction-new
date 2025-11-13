/**
 * 프로필 페이지
 * Development Philosophy - DDD Architecture (Layer 5️⃣)
 *
 * 책임:
 * - Server Component for SSR
 * - Repository를 통한 데이터 페칭
 * - Domain-driven structure with _components
 * - Clean separation of concerns
 */

import { redirect } from 'next/navigation';

import { createServerSupabaseClient } from '@lib/supabase/server';

import { ProfileHeader, ProfileInfoCard, ProfileContent } from './_components';
import { ProfileRepository } from './_repositories';

export default async function ProfilePage() {
  // 서버에서 인증 상태 확인
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect('/auth/login');
  }

  // Repository를 통한 프로필 정보 가져오기
  const repository = new ProfileRepository();
  const { profile } = await repository.getProfile(user.id);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileHeader />
      <ProfileInfoCard nickname={profile?.nickname} />
      <ProfileContent user={user} />
    </div>
  );
}
