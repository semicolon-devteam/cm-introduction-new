/**
 * 커뮤니티 소식 카드 컴포넌트
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@atoms/Card';

export function NewsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>커뮤니티 소식</CardTitle>
        <CardDescription>최신 업데이트 및 공지사항</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">Supabase 인증 시스템 구축 완료</h4>
            <p className="text-sm text-gray-600">
              이제 안전하고 확장 가능한 인증 시스템을 사용할 수 있습니다.
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">커뮤니티 템플릿 v1.0 출시</h4>
            <p className="text-sm text-gray-600">
              Semicolon 커뮤니티 템플릿이 정식으로 출시되었습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
