/**
 * 최근 활동 카드 컴포넌트
 * Development Philosophy: Client Component with Hook integration
 */

'use client';

import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@atoms/Card';

import { useActivities } from '../_hooks';

interface ActivityCardProps {
  /** 사용자 ID */
  userId: string;
}

export function ActivityCard({ userId }: ActivityCardProps) {
  const { activities, isLoading, error } = useActivities({
    userId,
    limit: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>최근 커뮤니티 활동 내역</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-gray-500">활동 내역을 불러오는 중...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            활동 내역을 불러오는데 실패했습니다.
          </p>
        )}

        {!isLoading && !error && activities.length === 0 && (
          <p className="text-sm text-gray-500">아직 활동 내역이 없습니다.</p>
        )}

        {!isLoading && !error && activities.length > 0 && (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="border-b pb-3 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.link ? (
                      <Link
                        href={activity.link}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {activity.description}
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
