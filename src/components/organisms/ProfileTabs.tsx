"use client";

import Link from "next/link";
import { Mail, Calendar, User } from "lucide-react";

import { Button } from "@atoms/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@atoms/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@atoms/Tabs";
import { signOutAction } from "@app/actions/auth.actions";

import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileTabsProps {
  user: SupabaseUser;
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  // Remove unused imports for now

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info">기본 정보</TabsTrigger>
        <TabsTrigger value="posts">작성한 글</TabsTrigger>
        <TabsTrigger value="settings">설정</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">계정 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">가입일</p>
                <p className="font-medium">
                  {new Date(user.created_at || "").toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">사용자 ID</p>
                <p className="font-mono text-xs">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="posts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">작성한 글</CardTitle>
            <CardDescription>아직 작성한 글이 없습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">커뮤니티에 첫 글을 작성해보세요!</p>
              <Button asChild>
                <Link href="/posts/new">글 작성하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">계정 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">알림 설정</h3>
              <p className="text-sm text-muted-foreground">이메일 및 푸시 알림을 설정합니다</p>
              <Button variant="outline" size="sm">
                알림 설정 관리
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">비밀번호 변경</h3>
              <p className="text-sm text-muted-foreground">
                계정 보안을 위해 정기적으로 비밀번호를 변경하세요
              </p>
              <Button variant="outline" size="sm">
                비밀번호 변경
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">로그아웃</h3>
              <p className="text-sm text-muted-foreground">현재 기기에서 로그아웃합니다</p>
              <Button variant="outline" size="sm" onClick={() => void handleSignOut()}>
                로그아웃
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-red-600">계정 삭제</h3>
              <p className="text-sm text-muted-foreground">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
              </p>
              <Button variant="destructive" size="sm">
                계정 삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
