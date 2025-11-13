/**
 * 빠른 작업 카드 컴포넌트
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@atoms/Card';
import { Button } from '@atoms/Button';

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
        <CardDescription>자주 사용하는 기능</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full" variant="outline">
          새 게시물 작성
        </Button>
        <Button className="w-full" variant="outline">
          프로필 편집
        </Button>
        <Button className="w-full" variant="outline">
          설정
        </Button>
      </CardContent>
    </Card>
  );
}
