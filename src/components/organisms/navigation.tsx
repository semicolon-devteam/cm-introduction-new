"use client";

import Link from "next/link";
import { Bell, Search, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@atoms/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@atoms/Avatar";
import { cn } from "@lib/utils";
import { useMenu } from "@/hooks/useMenu";

import type { MenuItem } from "@/models/menu.types";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { menus, isLoading } = useMenu({ device: "pc", userLevel: 1 });

  // 게시판 URL 생성 함수
  const getMenuHref = (menu: MenuItem): string => {
    if (menu.link_url) {
      return menu.link_url;
    }
    if (menu.board_id) {
      return `/boards/${menu.board_id}`;
    }
    return "#";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SC</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">Semicolon</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoading ? (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>메뉴 로딩중...</span>
              </div>
            ) : (
              menus.map((menu) => {
                const hasChildren = menu.children && menu.children.length > 0;

                if (hasChildren) {
                  // 하위 메뉴가 있는 경우 (드롭다운)
                  return (
                    <div key={menu.id} className="relative group">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <span>{menu.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>

                      {/* 드롭다운 메뉴 */}
                      <div className="absolute left-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          {menu.children?.map((child) => (
                            <Link key={child.id} href={getMenuHref(child)}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start px-4"
                              >
                                {child.name}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // 하위 메뉴가 없는 경우 (단독 링크)
                return (
                  <Link key={menu.id} href={getMenuHref(menu)}>
                    <Button variant="ghost" size="sm">
                      {menu.name}
                    </Button>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">검색</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
              3
            </span>
            <span className="sr-only">알림</span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://via.placeholder.com/32" alt="사용자" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">메뉴 토글</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden border-t", mobileMenuOpen ? "block" : "hidden")}>
        <div className="container py-4 space-y-2">
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-2">메뉴 로딩중...</div>
          ) : (
            menus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0;

              if (hasChildren) {
                // 하위 메뉴가 있는 경우
                return (
                  <div key={menu.id} className="space-y-1">
                    <div className="font-semibold text-sm px-3 py-2 text-muted-foreground">
                      {menu.name}
                    </div>
                    {menu.children?.map((child) => (
                      <Link key={child.id} href={getMenuHref(child)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start pl-6"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                );
              }

              // 하위 메뉴가 없는 경우
              return (
                <Link key={menu.id} href={getMenuHref(menu)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {menu.name}
                  </Button>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </header>
  );
}
