"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Github, Loader2, Download } from "lucide-react";

export interface IncidentItem {
  id: string;
  date: string;
  description: string;
  status: "resolved" | "ongoing" | "monitoring";
  githubUrl?: string;
}

export const INCIDENT_STATUS = {
  resolved: {
    label: "해결됨",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  ongoing: {
    label: "진행중",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  monitoring: {
    label: "모니터링",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
};

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
}

interface IncidentSectionProps {
  incidents: IncidentItem[];
  onAdd: () => void;
  onRemove: (incidentId: string) => void;
  onUpdate: (incidentId: string, updates: Partial<IncidentItem>) => void;
  onImportFromGitHub?: (incidents: IncidentItem[]) => void;
}

export function IncidentSection({
  incidents,
  onAdd,
  onRemove,
  onUpdate,
  onImportFromGitHub,
}: IncidentSectionProps) {
  const [isGithubConnected, setIsGithubConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGitHubPanel, setShowGitHubPanel] = useState(false);
  const [githubIssues, setGithubIssues] = useState<GitHubIssue[]>([]);
  const [selectedIssues, setSelectedIssues] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/admin/reports/github-status")
      .then((res) => res.json())
      .then((data) => setIsGithubConnected(data.connected))
      .catch(() => setIsGithubConnected(false));
  }, []);

  const fetchGitHubIssues = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reports/bugs?state=all&labels=bug");
      const data = await res.json();
      if (data.issues) {
        setGithubIssues(data.issues);
        setShowGitHubPanel(true);
      }
    } catch (err) {
      console.error("GitHub 이슈 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIssueSelection = (issueId: number) => {
    setSelectedIssues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const importSelectedIssues = () => {
    const newIncidents: IncidentItem[] = githubIssues
      .filter((issue) => selectedIssues.has(issue.id))
      .map((issue) => ({
        id: `gh-${issue.id}`,
        date: issue.created_at.split("T")[0],
        description: `[#${issue.number}] ${issue.title}`,
        status: issue.state === "closed" ? ("resolved" as const) : ("ongoing" as const),
        githubUrl: issue.html_url,
      }));

    if (onImportFromGitHub && newIncidents.length > 0) {
      onImportFromGitHub(newIncidents);
    }

    setShowGitHubPanel(false);
    setSelectedIssues(new Set());
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Label - Mantine style */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          인시던트/장애
        </label>

        {/* GitHub 연동 버튼 */}
        {isGithubConnected && (
          <button
            onClick={() => void fetchGitHubIssues()}
            disabled={isLoading}
            className="flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-[#373A40] rounded-md transition-all duration-150"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Github className="w-3.5 h-3.5" />
            )}
            GitHub에서 불러오기
          </button>
        )}
      </div>

      {/* GitHub Issues Panel */}
      {showGitHubPanel && (
        <div className="bg-[#25262b] rounded-lg border border-[#373A40] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Github className="w-4 h-4" />
              버그 이슈 선택
            </span>
            <span className="text-xs text-[#909296]">{selectedIssues.size}개 선택됨</span>
          </div>

          {githubIssues.length === 0 ? (
            <p className="text-sm text-[#5c5f66] text-center py-4">버그 이슈가 없습니다</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
              {githubIssues.map((issue) => (
                <label
                  key={issue.id}
                  className={`flex items-start gap-3 p-2.5 rounded-md cursor-pointer transition-all duration-150 ${
                    selectedIssues.has(issue.id)
                      ? "bg-brand-primary/10 border border-brand-primary/30"
                      : "bg-[#1a1b23] border border-transparent hover:border-[#373A40]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIssues.has(issue.id)}
                    onChange={() => toggleIssueSelection(issue.id)}
                    className="mt-0.5 w-4 h-4 rounded border-[#373A40] bg-[#25262b] text-brand-primary focus:ring-brand-primary/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#5c5f66]">#{issue.number}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${
                          issue.state === "open"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : "bg-gray-400/10 text-gray-400"
                        }`}
                      >
                        {issue.state === "open" ? "열림" : "닫힘"}
                      </span>
                    </div>
                    <p className="text-sm text-white truncate mt-0.5">{issue.title}</p>
                    <p className="text-xs text-[#5c5f66] mt-0.5">
                      {new Date(issue.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={importSelectedIssues}
              disabled={selectedIssues.size === 0}
              className="flex-1 h-8 flex items-center justify-center gap-1.5 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-all duration-150"
            >
              <Download className="w-4 h-4" />
              선택한 이슈 가져오기
            </button>
            <button
              onClick={() => {
                setShowGitHubPanel(false);
                setSelectedIssues(new Set());
              }}
              className="h-8 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all duration-150"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Incident Items */}
      <div className="space-y-3">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`bg-[#1a1b23] rounded-lg p-4 border ${INCIDENT_STATUS[incident.status].border} transition-all duration-150`}
          >
            {/* 상단 행: 날짜, 상태, 삭제 버튼 */}
            <div className="flex items-center gap-3 mb-3">
              {/* Date Input - Mantine style */}
              <input
                type="date"
                value={incident.date}
                onChange={(e) => onUpdate(incident.id, { date: e.target.value })}
                className="h-9 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
              />

              {/* Status Select - Mantine style */}
              <select
                value={incident.status}
                onChange={(e) =>
                  onUpdate(incident.id, { status: e.target.value as IncidentItem["status"] })
                }
                className={`h-9 px-3 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150 ${INCIDENT_STATUS[incident.status].bg} ${INCIDENT_STATUS[incident.status].color} border ${INCIDENT_STATUS[incident.status].border}`}
              >
                {(Object.keys(INCIDENT_STATUS) as Array<keyof typeof INCIDENT_STATUS>).map(
                  (status) => (
                    <option key={status} value={status} className="bg-[#25262b] text-white">
                      {INCIDENT_STATUS[status].label}
                    </option>
                  ),
                )}
              </select>

              {/* Delete Button - Mantine ActionIcon style */}
              <button
                onClick={() => onRemove(incident.id)}
                className="ml-auto w-9 h-9 flex items-center justify-center rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150"
                aria-label="인시던트 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Description Input - Mantine TextInput style */}
            <input
              type="text"
              value={incident.description}
              onChange={(e) => onUpdate(incident.id, { description: e.target.value })}
              placeholder="인시던트 내용을 입력하세요"
              className="w-full h-10 px-3 bg-[#25262b] border border-[#373A40] rounded-md text-sm text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all duration-150"
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {incidents.length === 0 && (
        <div className="text-center py-6 text-[#5c5f66] text-sm">등록된 인시던트가 없습니다</div>
      )}

      {/* Add Button - Mantine subtle button style */}
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all duration-150"
      >
        <Plus className="w-4 h-4" />
        <span>인시던트 추가</span>
      </button>
    </div>
  );
}
