/* eslint-disable max-lines, @typescript-eslint/no-misused-promises */
"use client";

import { useState, useMemo } from "react";
import { FileText, Copy, Check, Download, Github, RefreshCw, Edit3 } from "lucide-react";
import type { MilestoneItem, GoalItem, OperationsData, POData, GitHubIssue } from "./types";
import { SERVICE_STATUS, INCIDENT_STATUS, INFRA_CHANGE_TYPE } from "./types";

interface ReportGeneratorProps {
  milestones: MilestoneItem[];
  goals: GoalItem[];
  revenue: {
    currentRevenue: number;
    targetRevenue: number;
  };
  operations: OperationsData;
  poData: POData;
  githubConnected: boolean;
  githubIssues?: GitHubIssue[];
  projectTitle?: string;
}

type ReportType = "weekly" | "monthly";

const REPORT_TYPES: Array<{ id: ReportType; label: string; description: string }> = [
  { id: "weekly", label: "주간 리포트", description: "GitHub 이슈 기반 자동 생성" },
  { id: "monthly", label: "월간 통합 리포트", description: "목표 + GitHub 데이터 통합" },
];

export function ReportGenerator({
  milestones,
  goals,
  revenue,
  operations,
  poData,
  githubConnected,
  githubIssues = [],
  projectTitle,
}: ReportGeneratorProps) {
  const [selectedType, setSelectedType] = useState<ReportType>("weekly");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 월간 리포트용 목표/생각 입력
  const [monthlyGoalText, setMonthlyGoalText] = useState("");
  const [monthlyThoughts, setMonthlyThoughts] = useState("");

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // GitHub 이슈 통계 계산
  const issueStats = useMemo(() => {
    const byStatus: Record<string, GitHubIssue[]> = {};
    const byRepo: Record<string, GitHubIssue[]> = {};
    const byAssignee: Record<string, GitHubIssue[]> = {};

    githubIssues.forEach((issue) => {
      // 상태별 그룹
      const status = issue.status || "미지정";
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status].push(issue);

      // 레포별 그룹
      const repo = issue.repository || "기타";
      if (!byRepo[repo]) byRepo[repo] = [];
      byRepo[repo].push(issue);

      // 담당자별 그룹
      issue.assignees.forEach((assignee) => {
        if (!byAssignee[assignee]) byAssignee[assignee] = [];
        byAssignee[assignee].push(issue);
      });
    });

    return { byStatus, byRepo, byAssignee, total: githubIssues.length };
  }, [githubIssues]);

  // 이번 주 생성된 이슈
  const weeklyCreatedIssues = useMemo(() => {
    return githubIssues.filter((issue) => {
      const createdDate = new Date(issue.created_at);
      return createdDate >= weekStart && createdDate <= weekEnd;
    });
  }, [githubIssues, weekStart, weekEnd]);

  // 주간 리포트 생성 (GitHub 데이터 기반)
  const generateWeeklyReport = () => {
    const statusSummary = Object.entries(issueStats.byStatus)
      .map(([status, issues]) => `  - ${status}: ${issues.length}건`)
      .join("\n");

    const repoSummary = Object.entries(issueStats.byRepo)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([repo, issues]) => `  - ${repo}: ${issues.length}건`)
      .join("\n");

    const assigneeSummary = Object.entries(issueStats.byAssignee)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5)
      .map(([assignee, issues]) => `  - @${assignee}: ${issues.length}건`)
      .join("\n");

    const newIssuesList =
      weeklyCreatedIssues
        .slice(0, 10)
        .map(
          (issue) => `  - [${issue.repository || "N/A"}] #${issue.number || "N/A"}: ${issue.title}`,
        )
        .join("\n") || "  - 이번 주 생성된 이슈 없음";

    const inProgressIssues =
      githubIssues
        .filter((issue) => issue.status === "작업중" || issue.status === "In Progress")
        .slice(0, 10)
        .map((issue) => {
          const assignees = issue.assignees.length > 0 ? ` (@${issue.assignees.join(", @")})` : "";
          return `  - [${issue.repository || "N/A"}] #${issue.number || "N/A"}: ${issue.title}${assignees}`;
        })
        .join("\n") || "  - 진행중인 이슈 없음";

    const reviewIssues =
      githubIssues
        .filter((issue) => issue.status === "검수대기" || issue.status === "In Review")
        .slice(0, 10)
        .map(
          (issue) => `  - [${issue.repository || "N/A"}] #${issue.number || "N/A"}: ${issue.title}`,
        )
        .join("\n") || "  - 검수 대기 이슈 없음";

    return `# 주간 리포트
기간: ${formatDate(weekStart)} ~ ${formatDate(weekEnd)}
생성일: ${formatDate(today)}
프로젝트: ${projectTitle || "GitHub Project"}

---

## 📊 이슈 현황 요약
- **총 활성 이슈**: ${issueStats.total}건
- **이번 주 신규**: ${weeklyCreatedIssues.length}건

### 상태별 현황
${statusSummary || "  - 데이터 없음"}

### 레포지토리별 현황 (상위 5개)
${repoSummary || "  - 데이터 없음"}

### 담당자별 현황 (상위 5개)
${assigneeSummary || "  - 데이터 없음"}

---

## 🔄 진행중인 작업
${inProgressIssues}

## 👀 검수 대기
${reviewIssues}

## 🆕 이번 주 신규 이슈
${newIssuesList}

---

## 🖥️ 운영 현황
- 서비스 상태: ${SERVICE_STATUS[operations.serviceStatus].label}
- 업타임: ${operations.metrics.uptime || "N/A"}%
- 인시던트: ${operations.incidents.length}건

---

*이 리포트는 GitHub Project 데이터를 기반으로 자동 생성되었습니다.*`;
  };

  // 월간 통합 리포트 생성
  const generateMonthlyReport = () => {
    const statusSummary = Object.entries(issueStats.byStatus)
      .map(([status, issues]) => `  - ${status}: ${issues.length}건`)
      .join("\n");

    const repoSummary = Object.entries(issueStats.byRepo)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([repo, issues]) => `  - ${repo}: ${issues.length}건`)
      .join("\n");

    return `# 월간 통합 리포트
월: ${today.getFullYear()}년 ${today.getMonth() + 1}월
생성일: ${formatDate(today)}
프로젝트: ${projectTitle || "GitHub Project"}

---

## 🎯 이번 달 목표
${monthlyGoalText || "(목표를 입력해주세요)"}

---

## 📊 GitHub 이슈 현황
- **총 활성 이슈**: ${issueStats.total}건

### 상태별 현황
${statusSummary || "  - 데이터 없음"}

### 레포지토리별 현황
${repoSummary || "  - 데이터 없음"}

---

## 💰 수익 현황
- 현재 수익: ${revenue.currentRevenue ? `${revenue.currentRevenue.toLocaleString()}원` : "미입력"}
- 목표 수익: ${revenue.targetRevenue ? `${revenue.targetRevenue.toLocaleString()}원` : "미입력"}
- 달성률: ${revenue.targetRevenue > 0 ? ((revenue.currentRevenue / revenue.targetRevenue) * 100).toFixed(1) : 0}%

---

## 🖥️ 운영 요약
- 서비스 상태: ${SERVICE_STATUS[operations.serviceStatus].label}
- 총 인시던트: ${operations.incidents.length}건
- 해결된 인시던트: ${operations.incidents.filter((i) => i.status === "resolved").length}건

---

## 💭 회고 및 생각
${monthlyThoughts || "(회고 및 생각을 입력해주세요)"}

---

*이 리포트는 GitHub Project 데이터와 사용자 입력을 기반으로 생성되었습니다.*`;
  };

  const generateReport = () => {
    switch (selectedType) {
      case "monthly":
        return generateMonthlyReport();
      default:
        return generateWeeklyReport();
    }
  };

  const report = generateReport();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${selectedType}-${formatDate(today).replace(/\./g, "-")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const submitToGitHub = async () => {
    if (!githubConnected) {
      alert("GitHub 연결이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `[리포트] ${REPORT_TYPES.find((t) => t.id === selectedType)?.label} - ${formatDate(today)}`,
          body: report,
          labels: ["report", selectedType],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.html_url) {
          window.open(result.data.html_url, "_blank");
        } else {
          alert("GitHub 이슈가 생성되었습니다.");
        }
      } else {
        throw new Error("GitHub 이슈 생성 실패");
      }
    } catch (err) {
      console.error("GitHub 제출 실패:", err);
      alert("GitHub 이슈 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#373A40]">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-primary" />
          리포트 생성
        </h2>
        <p className="text-xs text-[#909296] mt-1">GitHub 이슈 {issueStats.total}개 연동됨</p>
      </div>

      <div className="p-5 space-y-4">
        {/* 리포트 타입 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">리포트 종류</label>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedType === type.id
                    ? "bg-brand-primary/10 border-brand-primary text-white"
                    : "bg-[#25262b] border-[#373A40] text-[#909296] hover:border-[#5c5f66]"
                }`}
              >
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs mt-0.5 opacity-70">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 월간 리포트 입력 필드 */}
        {selectedType === "monthly" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-1">
                <Edit3 className="w-4 h-4" />
                이번 달 목표
              </label>
              <textarea
                value={monthlyGoalText}
                onChange={(e) => setMonthlyGoalText(e.target.value)}
                placeholder="이번 달 달성하고자 하는 목표를 작성하세요..."
                className="w-full h-24 px-3 py-2 text-sm bg-[#25262b] border border-[#373A40] rounded-md text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-1">
                <Edit3 className="w-4 h-4" />
                회고 및 생각
              </label>
              <textarea
                value={monthlyThoughts}
                onChange={(e) => setMonthlyThoughts(e.target.value)}
                placeholder="이번 달 회고, 느낀 점, 다음 달 계획 등..."
                className="w-full h-24 px-3 py-2 text-sm bg-[#25262b] border border-[#373A40] rounded-md text-white placeholder-[#5c5f66] focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* 리포트 미리보기 */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">미리보기</label>
          <div className="bg-[#25262b] rounded-lg border border-[#373A40] p-4 max-h-[300px] overflow-y-auto">
            <pre className="text-sm text-[#c1c2c5] whitespace-pre-wrap font-mono">{report}</pre>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[#25262b] border border-[#373A40] rounded-md hover:bg-[#373A40] transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "복사됨!" : "복사"}</span>
          </button>
          <button
            onClick={downloadReport}
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[#25262b] border border-[#373A40] rounded-md hover:bg-[#373A40] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>다운로드</span>
          </button>
          <button
            onClick={submitToGitHub}
            disabled={isSubmitting || !githubConnected}
            className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            <span>{isSubmitting ? "제출중..." : "GitHub 이슈로 생성"}</span>
          </button>
        </div>

        {!githubConnected && <p className="text-xs text-amber-400">GitHub 연결이 필요합니다.</p>}
      </div>
    </div>
  );
}
