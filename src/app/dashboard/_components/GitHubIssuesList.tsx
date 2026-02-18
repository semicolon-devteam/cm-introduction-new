"use client";

import { useState } from "react";
import {
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  GitPullRequest,
  FileText,
  Users,
  GitBranch,
} from "lucide-react";
import type { GitHubIssue } from "./types";
import { PROJECT_STATUS_COLORS, PROJECT_PRIORITY_COLORS } from "./types";

interface GitHubIssuesListProps {
  issues: GitHubIssue[];
  isLoading?: boolean;
  onRefresh?: () => void;
  projectTitle?: string;
  periodLabel?: string;
  totalCount?: number;
}

// 라벨 색상 변환 (GitHub hex -> tailwind-compatible)
function getLabelStyle(color: string) {
  return {
    backgroundColor: `#${color}20`,
    color: `#${color}`,
    borderColor: `#${color}40`,
  };
}

// 상태별 색상 가져오기
function getStatusColor(status: string | null) {
  if (!status) return { bg: "bg-gray-500/20", text: "text-gray-400" };
  return PROJECT_STATUS_COLORS[status] || { bg: "bg-gray-500/20", text: "text-gray-400" };
}

// 우선순위 색상 가져오기
function getPriorityColor(priority: string | null) {
  if (!priority) return null;
  return PROJECT_PRIORITY_COLORS[priority] || { bg: "bg-gray-500/20", text: "text-gray-400" };
}

// 레포지토리별 색상 (3개 레포)
const REPO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "cm-land": { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40" },
  "cm-office": { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
  "cm-jungchipan": {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/40",
  },
};

function getRepoColor(repo: string | undefined) {
  if (!repo) return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/40" };
  return (
    REPO_COLORS[repo] || {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      border: "border-gray-500/40",
    }
  );
}

export function GitHubIssuesList({
  issues,
  isLoading,
  onRefresh,
  projectTitle,
  periodLabel,
  totalCount,
}: GitHubIssuesListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [repoFilter, setRepoFilter] = useState<string>("all");

  // 고유한 상태 목록 추출
  const uniqueStatuses = Array.from(
    new Set(issues.map((i) => i.status).filter(Boolean)),
  ) as string[];

  // 3개 고정 레포지토리 (이슈가 없어도 표시)
  const TARGET_REPOS = ["cm-land", "cm-office", "cm-jungchipan"];

  const filteredIssues = issues.filter((issue) => {
    // 프로젝트 Status 필터
    if (statusFilter !== "all" && issue.status !== statusFilter) return false;
    // 레포지토리 필터
    if (repoFilter !== "all" && issue.repository !== repoFilter) return false;
    return true;
  });

  // 레포지토리별 이슈 수 계산
  const repoIssueCounts = TARGET_REPOS.reduce(
    (acc, repo) => {
      acc[repo] = issues.filter((i) => i.repository === repo).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40]">
      {/* 헤더 */}
      <div className="p-4 border-b border-[#373A40]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-white">
              {projectTitle ? `프로젝트: ${projectTitle}` : "GitHub 프로젝트"}
            </h3>
            <span className="text-xs text-[#5c5f66]">
              {totalCount !== undefined && totalCount !== issues.length
                ? `${issues.length}개 / 전체 ${totalCount}개`
                : `${issues.length}개 아이템`}
            </span>
            {periodLabel && (
              <span className="px-2 py-0.5 text-xs bg-brand-primary/20 text-brand-primary rounded">
                {periodLabel}
              </span>
            )}
          </div>
          {/* 새로고침 */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#25262b] transition-colors disabled:opacity-50"
              aria-label="새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-[#909296] ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {/* 필터 영역 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 레포지토리 필터 (3개 고정) */}
          <div className="flex bg-[#25262b] rounded-md p-0.5">
            <button
              onClick={() => setRepoFilter("all")}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                repoFilter === "all"
                  ? "bg-brand-primary text-white"
                  : "text-[#909296] hover:text-white"
              }`}
            >
              전체
            </button>
            {TARGET_REPOS.map((repo) => {
              const repoColor = getRepoColor(repo);
              const isActive = repoFilter === repo;
              return (
                <button
                  key={repo}
                  onClick={() => setRepoFilter(repo)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? `${repoColor.bg} ${repoColor.text}`
                      : "text-[#909296] hover:text-white"
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  <span>{repo}</span>
                  <span className="text-[10px] opacity-70">({repoIssueCounts[repo] || 0})</span>
                </button>
              );
            })}
          </div>

          {/* Status 필터 */}
          {uniqueStatuses.length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 px-2 text-xs bg-[#25262b] border border-[#373A40] rounded-md text-[#909296] focus:outline-none focus:border-brand-primary"
            >
              <option value="all">모든 Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 이슈 목록 */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-4 h-4 bg-[#25262b] rounded-full mt-0.5" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-[#25262b] rounded mb-2" />
                  <div className="h-3 w-1/2 bg-[#25262b] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="p-8 text-center text-[#5c5f66]">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">이슈가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-[#25262b]">
            {filteredIssues.map((issue) => {
              const issueState = typeof issue.state === "string" ? issue.state.toLowerCase() : "";
              return (
                <a
                  key={issue.id}
                  href={issue.html_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 hover:bg-[#25262b]/50 transition-colors group"
                >
                  {/* 타입 아이콘 */}
                  {issue.type === "PULL_REQUEST" ? (
                    <GitPullRequest className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  ) : issue.type === "DRAFT_ISSUE" ? (
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  ) : issueState === "open" ? (
                    <AlertCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  )}

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white group-hover:text-brand-primary transition-colors line-clamp-1">
                        {issue.title}
                      </span>
                      {issue.html_url && (
                        <ExternalLink className="w-3 h-3 text-[#5c5f66] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 레포지토리 (눈에 띄게 표시) */}
                      {issue.repository && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded border flex items-center gap-1 ${getRepoColor(issue.repository).bg} ${getRepoColor(issue.repository).text} ${getRepoColor(issue.repository).border}`}
                        >
                          <GitBranch className="w-3 h-3" />
                          {issue.repository}
                        </span>
                      )}
                      {/* 번호 */}
                      {issue.number && (
                        <span className="text-xs text-[#5c5f66]">#{issue.number}</span>
                      )}
                      {/* Status */}
                      {issue.status && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(issue.status).bg} ${getStatusColor(issue.status).text}`}
                        >
                          {issue.status}
                        </span>
                      )}
                      {/* Priority */}
                      {issue.priority && getPriorityColor(issue.priority) && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(issue.priority)!.bg} ${getPriorityColor(issue.priority)!.text}`}
                        >
                          {issue.priority}
                        </span>
                      )}
                      {/* Assignees */}
                      {issue.assignees && issue.assignees.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[#909296]">
                          <Users className="w-3 h-3" />
                          {issue.assignees.slice(0, 2).join(", ")}
                          {issue.assignees.length > 2 && ` +${issue.assignees.length - 2}`}
                        </span>
                      )}
                    </div>

                    {/* 라벨 */}
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        {issue.labels.slice(0, 4).map((label) => (
                          <span
                            key={label.id}
                            className="text-xs px-1.5 py-0.5 rounded border"
                            style={getLabelStyle(label.color)}
                          >
                            {label.name}
                          </span>
                        ))}
                        {issue.labels.length > 4 && (
                          <span className="text-xs text-[#5c5f66]">+{issue.labels.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
