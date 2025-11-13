/**
 * 프로필 정보 카드
 * - 아바타
 * - 사용자 정보 (닉네임)
 * - 프로필 편집 버튼
 */

import { Edit, User } from 'lucide-react';

import { Button } from '@atoms/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@atoms/Card';

interface ProfileInfoCardProps {
  nickname?: string;
}

export function ProfileInfoCard({ nickname }: ProfileInfoCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">내 프로필</CardTitle>
              <CardDescription>계정 정보와 활동 내역을 확인하세요</CardDescription>
              {nickname && <p className="text-sm mt-1">닉네임: {nickname}</p>}
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            프로필 편집
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
