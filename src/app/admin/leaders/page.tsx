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
import { Textarea } from "@/components/atoms/Textarea";

import type { Leader, CreateLeaderParams, UpdateLeaderParams } from "@/models/leader.types";

interface LeaderFormData {
  slug: string;
  name: string;
  nickname: string;
  position: string;
  summary: string;
  skills: string;
  message: string;
  displayOrder: number;
}

const defaultFormData: LeaderFormData = {
  slug: "",
  name: "",
  nickname: "",
  position: "",
  summary: "",
  skills: "",
  message: "",
  displayOrder: 0,
};

export default function AdminLeadersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [formData, setFormData] = useState<LeaderFormData>(defaultFormData);

  // 리더 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "leaders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/leaders");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  // 리더 생성
  const createMutation = useMutation({
    mutationFn: async (params: CreateLeaderParams) => {
      const response = await fetch("/api/admin/leaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "leaders"] });
      setIsCreateOpen(false);
      setFormData(defaultFormData);
    },
  });

  // 리더 수정
  const updateMutation = useMutation({
    mutationFn: async ({ id, params }: { id: number; params: UpdateLeaderParams }) => {
      const response = await fetch(`/api/admin/leaders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "leaders"] });
      setEditingLeader(null);
      setFormData(defaultFormData);
    },
  });

  // 리더 삭제
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/leaders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "leaders"] });
    },
  });

  // 활성화 토글
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/admin/leaders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle");
      return response.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "leaders"] });
    },
  });

  const handleCreateSubmit = () => {
    createMutation.mutate({
      slug: formData.slug,
      name: formData.name,
      nickname: formData.nickname || null,
      position: formData.position,
      summary: formData.summary || null,
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
      message: formData.message || null,
      displayOrder: formData.displayOrder,
    });
  };

  const handleUpdateSubmit = () => {
    if (!editingLeader) return;
    updateMutation.mutate({
      id: editingLeader.id,
      params: {
        slug: formData.slug,
        name: formData.name,
        nickname: formData.nickname || null,
        position: formData.position,
        summary: formData.summary || null,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        message: formData.message || null,
        displayOrder: formData.displayOrder,
      },
    });
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData({
      slug: leader.slug,
      name: leader.name,
      nickname: leader.nickname || "",
      position: leader.position,
      summary: leader.summary || "",
      skills: leader.skills.join(", "),
      message: leader.message || "",
      displayOrder: leader.displayOrder,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const leaders: Leader[] = data?.leaders ?? [];

  const LeaderForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="garden"
          />
        </div>
        <div>
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="정원"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            placeholder="Garden"
          />
        </div>
        <div>
          <Label htmlFor="position">직책</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="대표"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">요약</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          placeholder="리더 소개..."
        />
      </div>
      <div>
        <Label htmlFor="skills">스킬 (쉼표 구분)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, TypeScript, Next.js"
        />
      </div>
      <div>
        <Label htmlFor="message">메시지</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="팀에 전하고 싶은 메시지..."
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
          <h1 className="text-2xl font-bold">리더 관리</h1>
          <p className="text-muted-foreground">팀 리더 정보를 관리합니다</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(defaultFormData)}>
              <Plus className="w-4 h-4 mr-2" />
              리더 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 리더 추가</DialogTitle>
            </DialogHeader>
            <LeaderForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>리더 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
          ) : leaders.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">등록된 리더가 없습니다</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>순서</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>닉네임</TableHead>
                  <TableHead>직책</TableHead>
                  <TableHead>스킬</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaders.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell>{leader.displayOrder}</TableCell>
                    <TableCell className="font-medium">{leader.name}</TableCell>
                    <TableCell>{leader.nickname || "-"}</TableCell>
                    <TableCell>{leader.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {leader.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {leader.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{leader.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={leader.isActive ? "default" : "secondary"}>
                        {leader.isActive ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveMutation.mutate({ id: leader.id, isActive: !leader.isActive })}
                          title={leader.isActive ? "비활성화" : "활성화"}
                        >
                          {leader.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Dialog open={editingLeader?.id === leader.id} onOpenChange={(open) => !open && setEditingLeader(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(leader)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>리더 수정</DialogTitle>
                            </DialogHeader>
                            <LeaderForm isEdit />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(leader.id)}
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
