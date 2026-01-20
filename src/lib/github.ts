/**
 * GitHub API 유틸리티
 * - Issue 생성
 * - 버그 라벨 Issue 조회
 */

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

function getConfig(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    throw new Error(
      "GitHub 설정이 누락되었습니다. .env.local 파일에 GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO를 설정해주세요.",
    );
  }

  return { token, owner, repo };
}

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

// Issue 생성
export interface CreateIssueParams {
  title: string;
  body: string;
  labels?: string[];
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;
  user: {
    login: string;
    avatar_url: string;
  } | null;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export async function createIssue(params: CreateIssueParams): Promise<GitHubIssue> {
  const config = getConfig();
  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/issues`;

  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(config.token),
    body: JSON.stringify({
      title: params.title,
      body: params.body,
      labels: params.labels || [],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub Issue 생성 실패: ${error.message || response.statusText}`);
  }

  return response.json();
}

// 버그 라벨 Issue 조회
export interface GetBugIssuesParams {
  state?: "open" | "closed" | "all";
  labels?: string[];
  per_page?: number;
  page?: number;
}

export async function getBugIssues(params: GetBugIssuesParams = {}): Promise<GitHubIssue[]> {
  const config = getConfig();

  const searchParams = new URLSearchParams();
  searchParams.set("state", params.state || "open");
  searchParams.set("labels", params.labels?.join(",") || "bug");
  searchParams.set("per_page", String(params.per_page || 30));
  searchParams.set("page", String(params.page || 1));
  searchParams.set("sort", "created");
  searchParams.set("direction", "desc");

  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/issues?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(config.token),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub Issue 조회 실패: ${error.message || response.statusText}`);
  }

  return response.json();
}

// 라벨 목록 조회
export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

export async function getLabels(): Promise<GitHubLabel[]> {
  const config = getConfig();
  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/labels`;

  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(config.token),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub 라벨 조회 실패: ${error.message || response.statusText}`);
  }

  return response.json();
}

// GitHub 설정 확인
export async function checkGitHubConnection(): Promise<{
  connected: boolean;
  repo?: string;
  error?: string;
}> {
  try {
    const config = getConfig();
    const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(config.token),
    });

    if (!response.ok) {
      return { connected: false, error: "저장소에 접근할 수 없습니다" };
    }

    const repo = await response.json();
    return { connected: true, repo: repo.full_name };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "GitHub 연결 실패",
    };
  }
}
