"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Building2, MessageSquare, Clock } from "lucide-react";

import { Button } from "@/components/atoms/Button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";

import type { Contact } from "@/app/contacts/_repositories";
import type { InquiryStatus } from "@/lib/supabase/database.types";

const STATUS_OPTIONS: { value: InquiryStatus; label: string; color: string }[] = [
  { value: "NEW", label: "신규", color: "bg-blue-500" },
  { value: "ACK", label: "확인", color: "bg-yellow-500" },
  { value: "IN_PROGRESS", label: "진행중", color: "bg-purple-500" },
  { value: "RESOLVED", label: "해결", color: "bg-green-500" },
  { value: "CLOSED", label: "종료", color: "bg-gray-500" },
];

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
  return date.toLocaleDateString("ko-KR");
}

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newStatus, setNewStatus] = useState<InquiryStatus | "">("");
  const [adminNotes, setAdminNotes] = useState("");

  // 문의 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "contacts", statusFilter],
    queryFn: async () => {
      const url = statusFilter === "all"
        ? "/api/admin/contacts"
        : `/api/admin/contacts?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  // 문의 상태 업데이트
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: InquiryStatus; adminNotes?: string }) => {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] });
      setSelectedContact(null);
      setNewStatus("");
      setAdminNotes("");
    },
  });

  const handleOpenDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setNewStatus(contact.status);
    setAdminNotes(contact.adminNotes || "");
  };

  const handleUpdateStatus = () => {
    if (!selectedContact || !newStatus) return;
    updateStatusMutation.mutate({
      id: selectedContact.id,
      status: newStatus,
      adminNotes,
    });
  };

  const contacts: Contact[] = data?.contacts ?? [];

  const getStatusBadge = (status: InquiryStatus) => {
    const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <Badge variant="outline" className="font-medium">
        <span className={`w-2 h-2 rounded-full mr-2 ${statusOption?.color || "bg-gray-500"}`} />
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">문의 관리</h1>
          <p className="text-muted-foreground">외부 문의를 관리합니다</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문의 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
          ) : contacts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">문의가 없습니다</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>회사</TableHead>
                  <TableHead>접수일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company || "-"}</TableCell>
                    <TableCell>{formatRelativeTime(contact.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDetail(contact)}>
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 문의 상세 다이얼로그 */}
      <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>문의 상세</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-6">
              {/* 문의자 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{selectedContact.email}</span>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContact.phone}</span>
                  </div>
                )}
                {selectedContact.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedContact.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(selectedContact.createdAt).toLocaleString("ko-KR")}</span>
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <Label>문의 내용</Label>
                </div>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              {/* 상태 변경 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>상태 변경</Label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as InquiryStatus)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 관리자 메모 */}
              <div>
                <Label htmlFor="adminNotes">관리자 메모</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="내부 처리 메모..."
                  className="mt-2"
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={updateStatusMutation.isPending || !newStatus}
                className="w-full"
              >
                {updateStatusMutation.isPending ? "저장 중..." : "상태 업데이트"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
