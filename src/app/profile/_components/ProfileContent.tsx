/**
 * 프로필 콘텐츠
 * - ProfileTabs 래퍼 with Dynamic Import
 * - Code splitting for better performance
 */

'use client';

import dynamic from 'next/dynamic';

import type { User } from '@supabase/supabase-js';

// Dynamic import for ProfileTabs (lazy loading)
const ProfileTabs = dynamic(() => import('@organisms/ProfileTabs').then((mod) => ({ default: mod.ProfileTabs })), {
  loading: () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 rounded" />
      <div className="h-64 bg-slate-200 rounded" />
    </div>
  ),
  ssr: false, // Client-only component
});

interface ProfileContentProps {
  user: User;
}

export function ProfileContent({ user }: ProfileContentProps) {
  return <ProfileTabs user={user} />;
}
