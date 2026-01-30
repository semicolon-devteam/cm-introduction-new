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

// 모든 이슈 조회 (라벨 필터 없이)
export interface GetAllIssuesParams {
  state?: "open" | "closed" | "all";
  per_page?: number;
  page?: number;
}

export async function getAllIssues(params: GetAllIssuesParams = {}): Promise<GitHubIssue[]> {
  const config = getConfig();

  const searchParams = new URLSearchParams();
  searchParams.set("state", params.state || "open");
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

// ============================================
// GitHub Organization Issues Search API (REST)
// 빠른 검색을 위해 REST Search API 사용
// ============================================

interface OrgIssueSearchResult {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at: string;
  repository_url: string;
  labels: Array<{ name: string; color: string }>;
  assignees: Array<{ login: string }>;
}

// 특정 레포지토리만 조회 (설정 가능)
const TARGET_REPOS = ["cm-land", "cm-office", "cm-jungchipan"];

// 조직의 특정 레포지토리 열린 이슈만 검색 (REST API)
export async function searchOrgOpenIssues(org: string): Promise<OrgIssueSearchResult[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const allIssues: OrgIssueSearchResult[] = [];

  // 각 레포지토리별로 버그 이슈만 검색
  const repoQueries = TARGET_REPOS.map((repo) => `repo:${org}/${repo} is:issue is:open label:bug`);

  for (const query of repoQueries) {
    let page = 1;
    const perPage = 100;

    while (true) {
      const url = `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&sort=updated&order=desc`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        console.error("GitHub Search API 오류:", response.statusText);
        break;
      }

      const data = await response.json();
      const items = data.items || [];

      if (items.length === 0) break;

      allIssues.push(...items);

      // 마지막 페이지
      if (items.length < perPage) break;
      page++;
    }
  }

  // 업데이트 날짜순 정렬
  allIssues.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return allIssues;
}

// ============================================
// GitHub Organization Projects API (GraphQL)
// ============================================

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

interface ProjectConfig {
  token: string;
  org: string;
  projectNumber: number;
}

function getProjectConfig(): ProjectConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const org = process.env.GITHUB_ORG;
  const projectNumber = process.env.GITHUB_PROJECT_NUMBER;

  if (!token || !org || !projectNumber) {
    return null;
  }

  return { token, org, projectNumber: parseInt(projectNumber, 10) };
}

// 프로젝트 아이템 타입
export interface ProjectItem {
  id: string;
  type: "ISSUE" | "DRAFT_ISSUE" | "PULL_REQUEST";
  title: string;
  status: string | null;
  priority: string | null;
  assignees: string[];
  labels: Array<{ name: string; color: string }>;
  repository: string | null;
  number: number | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
  state: "OPEN" | "CLOSED" | "MERGED" | null;
}

// 제외할 상태 (서버에서 필터링 불가하므로 클라이언트에서 필터링)
const EXCLUDED_STATUSES = ["병합됨", "버려짐", "Done", "Closed"];

// 조직 프로젝트의 활성 아이템만 조회 (OPEN 상태 + 제외 상태 필터링)
export async function getProjectItems(): Promise<ProjectItem[]> {
  const config = getProjectConfig();
  if (!config) {
    console.log("GitHub Project 설정이 없습니다.");
    return [];
  }

  const query = `
    query($org: String!, $projectNumber: Int!, $cursor: String) {
      organization(login: $org) {
        projectV2(number: $projectNumber) {
          title
          items(first: 100, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              type
              createdAt
              updatedAt
              fieldValues(first: 20) {
                nodes {
                  ... on ProjectV2ItemFieldTextValue {
                    text
                    field { ... on ProjectV2Field { name } }
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field { ... on ProjectV2SingleSelectField { name } }
                  }
                  ... on ProjectV2ItemFieldDateValue {
                    date
                    field { ... on ProjectV2Field { name } }
                  }
                }
              }
              content {
                ... on Issue {
                  title
                  number
                  url
                  state
                  labels(first: 10) {
                    nodes { name color }
                  }
                  assignees(first: 5) {
                    nodes { login }
                  }
                  repository { name }
                }
                ... on PullRequest {
                  title
                  number
                  url
                  state
                  labels(first: 10) {
                    nodes { name color }
                  }
                  assignees(first: 5) {
                    nodes { login }
                  }
                  repository { name }
                }
                ... on DraftIssue {
                  title
                  assignees(first: 5) {
                    nodes { login }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const allItems: ProjectItem[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;
  let totalProcessed = 0;

  while (hasNextPage) {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          org: config.org,
          projectNumber: config.projectNumber,
          cursor,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub GraphQL API 오류:", errorText);
      throw new Error(`GitHub Project 조회 실패: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL 오류:", data.errors);
      throw new Error(`GraphQL 오류: ${data.errors[0]?.message || "알 수 없는 오류"}`);
    }

    const project = data.data?.organization?.projectV2;
    if (!project) {
      console.log("프로젝트를 찾을 수 없습니다.");
      break;
    }

    const items = project.items;
    const nodes = items.nodes || [];
    totalProcessed += nodes.length;

    for (const node of nodes) {
      // 필드 값에서 Status와 Priority 추출
      let status: string | null = null;
      let priority: string | null = null;

      for (const fieldValue of node.fieldValues?.nodes || []) {
        if (fieldValue?.field?.name === "Status" && fieldValue.name) {
          status = fieldValue.name;
        }
        if (fieldValue?.field?.name === "Priority" && fieldValue.name) {
          priority = fieldValue.name;
        }
      }

      const content = node.content;
      if (!content) continue;

      // CLOSED/MERGED 상태 또는 제외 상태인 경우 건너뛰기 (메모리 절약)
      const itemState = content.state || null;
      if (itemState === "CLOSED" || itemState === "MERGED") continue;
      if (status && EXCLUDED_STATUSES.includes(status)) continue;

      const item: ProjectItem = {
        id: node.id,
        type: node.type,
        title: content.title || "제목 없음",
        status,
        priority,
        assignees: content.assignees?.nodes?.map((a: { login: string }) => a.login) || [],
        labels: content.labels?.nodes?.map((l: { name: string; color: string }) => ({
          name: l.name,
          color: l.color,
        })) || [],
        repository: content.repository?.name || null,
        number: content.number || null,
        url: content.url || null,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        state: itemState,
      };

      allItems.push(item);
    }

    hasNextPage = items.pageInfo.hasNextPage;
    cursor = items.pageInfo.endCursor;

    // 진행 상황 로깅
    console.log(`  페이징 진행: ${totalProcessed}개 처리, ${allItems.length}개 활성 아이템 수집`);
  }

  console.log(`최종: 총 ${totalProcessed}개 중 ${allItems.length}개 활성 아이템 반환`);
  return allItems;
}

// 프로젝트 연결 상태 확인
export async function checkProjectConnection(): Promise<{
  connected: boolean;
  projectTitle?: string;
  itemCount?: number;
  error?: string;
}> {
  const config = getProjectConfig();
  if (!config) {
    return { connected: false, error: "GitHub Project 설정이 누락되었습니다 (GITHUB_ORG, GITHUB_PROJECT_NUMBER)" };
  }

  const query = `
    query($org: String!, $projectNumber: Int!) {
      organization(login: $org) {
        projectV2(number: $projectNumber) {
          title
          items { totalCount }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          org: config.org,
          projectNumber: config.projectNumber,
        },
      }),
    });

    if (!response.ok) {
      return { connected: false, error: "GitHub API 요청 실패" };
    }

    const data = await response.json();

    if (data.errors) {
      return { connected: false, error: data.errors[0]?.message || "GraphQL 오류" };
    }

    const project = data.data?.organization?.projectV2;
    if (!project) {
      return { connected: false, error: "프로젝트를 찾을 수 없습니다" };
    }

    return {
      connected: true,
      projectTitle: project.title,
      itemCount: project.items.totalCount,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    };
  }
}
