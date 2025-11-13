import {
  Bookmark,
  Calendar,
  ChevronRight,
  Hash,
  HelpCircle,
  LogIn,
  LogOut,
  Settings,
  TrendingUp,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@atoms/Badge";
import { Button } from "@atoms/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@atoms/Card";
import { ScrollArea } from "@atoms/ScrollArea";
import { cn } from "@lib/utils";

interface SidebarProps {
  className?: string;
  user?: { email?: string; id?: string }; // Basic user type
  loading?: boolean;
  onSignOut?: () => void;
  trendingTopics?: Array<{ name: string; count: number }>;
  communityStats?: Array<{ label: string; value: string; icon: string }>;
  quickLinks?: Array<{ icon: string; label: string; href: string }>;
}

const iconMap = {
  Users,
  Calendar,
  Trophy,
  Bookmark,
  TrendingUp,
  Hash,
  HelpCircle,
} as const;

export function Sidebar({
  className,
  user,
  loading = false,
  onSignOut,
  trendingTopics = [],
  communityStats = [],
  quickLinks = [],
}: SidebarProps) {
  return (
    <aside className={cn("w-80 space-y-6", className)}>
      {/* 사용자 섹션 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">내 프로필</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.email?.split("@")[0]}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start" variant="ghost">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    프로필 보기
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="ghost">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                </Button>
                <Button onClick={onSignOut} className="w-full justify-start" variant="ghost">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">로그인하고 커뮤니티에 참여하세요</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    회원가입
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 인기 토픽 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            인기 토픽
          </CardTitle>
          <CardDescription>지금 가장 뜨거운 주제들</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[200px]">
            <div className="px-6 pb-4 space-y-1">
              {trendingTopics.map((topic, index) => (
                <Link
                  key={index}
                  href={`/topics/${encodeURIComponent(topic.name)}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
                >
                  <span className="text-sm font-medium group-hover:text-primary">
                    #{topic.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 커뮤니티 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">커뮤니티 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {communityStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold">{stat.value}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 빠른 링크 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 링크</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-2 pb-2">
            {quickLinks.map((link, index) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];
              return (
                <Button key={index} asChild variant="ghost" className="w-full justify-between">
                  <Link href={link.href}>
                    <div className="flex items-center">
                      {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                      {link.label}
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
