"use client";

import { Badge } from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table";

import type { MemberStat } from "../_api-clients";

interface MemberStatsTableProps {
  data: MemberStat[] | undefined;
  isLoading: boolean;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-20 h-4 bg-muted animate-pulse rounded" />
          <div className="w-16 h-4 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-4 bg-muted animate-pulse rounded" />
          <div className="w-24 h-4 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export function MemberStatsTable({ data, isLoading }: MemberStatsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">팀원별 사용 현황</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <TableSkeleton />
        ) : data.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            데이터가 없습니다
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead className="text-right">총 사용</TableHead>
                <TableHead>주요 스킬</TableHead>
                <TableHead className="text-right">마지막 활동</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell className="font-medium">
                    {member.displayName}
                  </TableCell>
                  <TableCell className="text-right">
                    {member.totalInteractions.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.topSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatRelativeTime(member.lastActiveAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
