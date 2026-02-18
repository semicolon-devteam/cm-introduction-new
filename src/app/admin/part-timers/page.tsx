"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

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
  DialogTrigger,
} from "@/components/atoms/Dialog";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";

import type {
  PartTimer,
  CreatePartTimerParams,
  UpdatePartTimerParams,
} from "@/app/part-timers/_repositories";

interface PartTimerFormData {
  nickname: string;
  role: string;
  team: string;
  displayOrder: number;
}

const defaultFormData: PartTimerFormData = {
  nickname: "",
  role: "",
  team: "",
  displayOrder: 0,
};

export default function AdminPartTimersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPartTimer, setEditingPartTimer] = useState<PartTimer | null>(null);
  const [formData, setFormData] = useState<PartTimerFormData>(defaultFormData);

  // 파트타이머 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "part-timers"],
    queryFn: async () => {
      const response = await fetch("/api/admin/part-timers");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  // 파트타이머 생성
  const createMutation = useMutation({
    mutationFn: async (params: CreatePartTimerParams) => {
      const response = await fetch("/api/admin/part-timers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "part-timers"] });
      setIsCreateOpen(false);
      setFormData(defaultFormData);
    },
  });

  // 파트타이머 수정
  const updateMutation = useMutation({
    mutationFn: async ({ id, params }: { id: number; params: UpdatePartTimerParams }) => {
      const response = await fetch(`/api/admin/part-timers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "part-timers"] });
      setEditingPartTimer(null);
      setFormData(defaultFormData);
    },
  });

  // 파트타이머 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/part-timers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "part-timers"] });
    },
  });

  // 활성화 토글
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/admin/part-timers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "part-timers"] });
    },
  });

  const handleCreateSubmit = () => {
    createMutation.mutate({
      nickname: formData.nickname,
      role: formData.role,
      team: formData.team || null,
      displayOrder: formData.displayOrder,
    });
  };

  const handleUpdateSubmit = () => {
    if (!editingPartTimer) return;
    updateMutation.mutate({
      id: editingPartTimer.id,
      params: {
        nickname: formData.nickname,
        role: formData.role,
        team: formData.team || null,
        displayOrder: formData.displayOrder,
      },
    });
  };

  const handleEdit = (partTimer: PartTimer) => {
    setEditingPartTimer(partTimer);
    setFormData({
      nickname: partTimer.nickname,
      role: partTimer.role,
      team: partTimer.team || "",
      displayOrder: partTimer.displayOrder,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const partTimers: PartTimer[] = data?.partTimers ?? [];

  const PartTimerForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          placeholder="닉네임"
        />
      </div>
      <div>
        <Label htmlFor="role">역할</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="프론트엔드 개발"
        />
      </div>
      <div>
        <Label htmlFor="team">팀</Label>
        <Input
          id="team"
          value={formData.team}
          onChange={(e) => setFormData({ ...formData, team: e.target.value })}
          placeholder="개발팀"
        />
      </div>
      <div>
        <Label htmlFor="displayOrder">표시 순서</Label>
        <Input
          id="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
        />
      </div>
      <Button
        onClick={isEdit ? handleUpdateSubmit : handleCreateSubmit}
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full"
      >
        {createMutation.isPending || updateMutation.isPending ? "저장 중..." : isEdit ? "수정" : "생성"}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">파트타이머 관리</h1>
          <p className="text-muted-foreground">파트타이머 정보를 관리합니다</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(defaultFormData)}>
              <Plus className="w-4 h-4 mr-2" />
              파트타이머 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 파트타이머 추가</DialogTitle>
            </DialogHeader>
            <PartTimerForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>파트타이머 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
          ) : partTimers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">등록된 파트타이머가 없습니다</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>순서</TableHead>
                  <TableHead>닉네임</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>팀</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partTimers.map((partTimer) => (
                  <TableRow key={partTimer.id}>
                    <TableCell>{partTimer.displayOrder}</TableCell>
                    <TableCell className="font-medium">{partTimer.nickname}</TableCell>
                    <TableCell>{partTimer.role}</TableCell>
                    <TableCell>{partTimer.team || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={partTimer.isActive ? "default" : "secondary"}>
                        {partTimer.isActive ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveMutation.mutate({ id: partTimer.id, isActive: !partTimer.isActive })}
                          title={partTimer.isActive ? "비활성화" : "활성화"}
                        >
                          {partTimer.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Dialog open={editingPartTimer?.id === partTimer.id} onOpenChange={(open) => !open && setEditingPartTimer(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(partTimer)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>파트타이머 수정</DialogTitle>
                            </DialogHeader>
                            <PartTimerForm isEdit />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(partTimer.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
