/**
 * 프로필 정보 카드 컴포넌트
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@atoms/Card';

interface ProfileCardProps {
  email: string;
  userId: string;
  createdAt: string;
}

export function ProfileCard({ email, userId, createdAt }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>현재 로그인된 사용자 정보</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">이메일:</span> {email}
          </p>
          <p className="text-sm">
            <span className="font-medium">ID:</span> {userId}
          </p>
          <p className="text-sm">
            <span className="font-medium">가입일:</span>{' '}
            {new Date(createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
