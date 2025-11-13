/**
 * Sidebar Container Component
 * Development Philosophy:
 * - Container Pattern: UI와 비즈니스 로직 분리
 * - Error handling with user feedback
 * - Loading states for better UX
 * - No hardcoded mock data (실제 DB 연동)
 * - Hydration-safe: Client-side only rendering
 */

'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/auth';
import { signOutAction } from '@/app/actions/auth.actions';
import { useSidebarData } from '@/hooks/useSidebarData';
import { QUICK_LINKS } from '@/constants/sidebar.constants';

import { Sidebar } from './sidebar';

interface SidebarContainerProps {
  className?: string;
}

export function SidebarContainer({ className }: SidebarContainerProps) {
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const {
    trendingTopics,
    communityStats,
    isLoading: dataLoading,
    error,
  } = useSidebarData();

  // Client-side only rendering (하이드레이션 오류 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 렌더링 시 빈 div 반환
  if (!mounted) {
    return <div className={className} style={{ width: '320px', height: '800px' }} />;
  }

  const handleSignOut = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error('Sign out failed:', error);
      // TODO: Toast notification 추가 필요
    }
  };

  // 인증 또는 데이터 로딩 중
  const isLoading = authLoading || dataLoading;

  // 에러 발생 시에도 UI는 렌더링 (빈 데이터로)
  // 사용자 경험을 위해 전체 UI를 숨기지 않음
  if (error) {
    console.warn('Sidebar data error (continuing with empty data):', error);
  }

  return (
    <Sidebar
      className={className}
      user={user || undefined}
      loading={isLoading}
      onSignOut={() => void handleSignOut()}
      trendingTopics={trendingTopics}
      communityStats={communityStats}
      quickLinks={[...QUICK_LINKS]}
    />
  );
}
