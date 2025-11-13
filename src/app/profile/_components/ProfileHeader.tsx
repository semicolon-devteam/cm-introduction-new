/**
 * 프로필 페이지 헤더
 * - 뒤로가기 버튼
 */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@atoms/Button';

export function ProfileHeader() {
  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로가기
        </Link>
      </Button>
    </div>
  );
}
