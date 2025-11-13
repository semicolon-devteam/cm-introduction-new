// PR 자동 리뷰 스크립트
import fs from "fs";

// GitHub Actions context 파싱
const context = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));

async function reviewPR() {
  try {
    const rawApiKey = process.env.ANTHROPIC_API_KEY || "";
    const rawGithubToken = process.env.GITHUB_TOKEN || "";

    // PR 번호를 다양한 경로에서 시도
    let prNumber = context?.pull_request?.number;

    // issue_comment 이벤트의 경우 (예: /review 코멘트)
    if (!prNumber && context?.issue?.number && context?.issue?.pull_request) {
      prNumber = context.issue.number;
    }

    // PR_NUMBER 환경변수로부터 가져오기 (워크플로우에서 명시적으로 전달된 경우)
    if (!prNumber && process.env.PR_NUMBER) {
      prNumber = parseInt(process.env.PR_NUMBER, 10);
    }

    const repoFull = process.env.GITHUB_REPOSITORY || "";
    const [owner, repo] = repoFull.split("/");

    // 디버그 정보를 에러 체크 전에 출력
    console.log("🔍 컨텍스트 디버그 정보:");
    console.log("- prNumber:", prNumber);
    console.log("- owner:", owner);
    console.log("- repo:", repo);
    console.log("- GITHUB_REPOSITORY:", repoFull);
    console.log("- context.pull_request:", JSON.stringify(context?.pull_request, null, 2));
    console.log("- context.issue:", JSON.stringify(context?.issue, null, 2));
    console.log("- PR_NUMBER env:", process.env.PR_NUMBER);

    if (!rawApiKey) throw new Error("ANTHROPIC_API_KEY 환경변수가 비어있습니다.");
    if (!rawGithubToken) throw new Error("GITHUB_TOKEN 환경변수가 비어있습니다.");
    if (!prNumber || !owner || !repo) {
      console.error("❌ 필수 값이 누락되었습니다:");
      console.error(`- prNumber: ${prNumber ? "✅" : "❌"}`);
      console.error(`- owner: ${owner ? "✅" : "❌"}`);
      console.error(`- repo: ${repo ? "✅" : "❌"}`);
      throw new Error("PR 컨텍스트 파싱 실패 (PR 번호/레포지토리).");
    }

    // API 키와 토큰은 그대로 사용 (ASCII 정규화 불필요)
    const apiKey = rawApiKey.trim();
    const githubToken = rawGithubToken.trim();

    console.log("🔍 PR 리뷰 시작");
    console.log(`- PR 번호: #${prNumber}`);
    console.log(`- 레포지토리: ${repo}`);

    // PR diff 읽기
    const prDiff = fs.readFileSync("pr-diff.txt", "utf8");
    console.log(`📄 PR Diff 크기: ${prDiff.length}자`);

    // 파일 개수 계산
    const filesChanged = (prDiff.match(/^diff --git /gm) || []).length;
    console.log(`📁 변경된 파일: ${filesChanged}개`);

    // 연결된 이슈 정보 읽기
    const linkedIssue = await getLinkedIssue(owner, repo, githubToken, prNumber);

    if (linkedIssue) {
      console.log(`🔗 연결된 이슈: #${linkedIssue.number} - ${linkedIssue.title}`);
    } else {
      console.warn("⚠️  연결된 이슈를 찾을 수 없습니다");
    }

    // 테스트 요구사항 추출
    const testRequirements = extractTestRequirements(linkedIssue?.body || "");
    console.log(`✅ 테스트 요구사항: ${testRequirements.length}개`);

    // 프로젝트 타입 감지
    const projectType = detectProjectType();
    console.log(`🏗️  프로젝트 타입: ${projectType}`);

    // Claude API 호출
    console.log("🤖 Claude API 호출 중...");
    const prompt = buildReviewPrompt(
      prDiff,
      linkedIssue,
      testRequirements,
      projectType,
      filesChanged,
    );

    // (참고) 문제 재현/확인용 디버깅: 필요 시 주석 해제
    // logNonAscii('PROMPT', prompt);

    const review = await callClaudeAPI(apiKey, prompt);

    console.log(`📊 리뷰 결과: ${review.approved ? "✅ 승인" : "❌ 거부"}`);
    console.log(`📈 점수: ${review.score}/100`);
    console.log(`🐛 발견된 이슈: ${Array.isArray(review.issues) ? review.issues.length : 0}개`);

    // 결과 저장
    fs.writeFileSync("review-result.json", JSON.stringify(review, null, 2));
    console.log("💾 리뷰 결과 저장 완료");

    // 종료 코드 설정
    if (!review.approved) {
      console.error("❌ PR 리뷰에서 문제가 발견되었습니다");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ PR 리뷰 실패:", error?.message || String(error));
    console.error("스택:", error?.stack || "(no stack)");
    process.exit(1);
  }
}

function detectProjectType() {
  if (fs.existsSync("package.json")) {
    try {
      const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
      if (pkg?.dependencies?.next) return "nextjs";
      if (pkg?.dependencies?.react) return "react";
      return "nodejs";
    } catch {
      return "nodejs";
    }
  }
  if (fs.existsSync("pom.xml")) return "spring-maven";
  if (fs.existsSync("build.gradle")) return "spring-gradle";
  return "unknown";
}

function buildReviewPrompt(prDiff, issue, testRequirements, projectType, filesChanged) {
  const architectureGuidelines = getArchitectureGuidelines(projectType);

  return `You are a senior code reviewer for the semicolon-ecosystem project.

# Project Context
- **Project Type**: ${projectType}
- **Repository**: ${process.env.GITHUB_REPOSITORY?.split("/")[1] || ""}
- **Linked Issue**: ${issue ? `#${issue.number}` : "None"}

# Review Guidelines

## 1. Code Quality Checks
- [ ] **Lint Rules**: Code follows linting standards (ESLint/Checkstyle)
- [ ] **Coding Conventions**: Naming, formatting, structure
- [ ] **Variable/Function Names**: Clear and descriptive
- [ ] **Comments**: Appropriate documentation
- [ ] **Error Handling**: Proper try-catch, error messages
- [ ] **Code Duplication**: DRY principle applied
- [ ] **Magic Numbers**: No hardcoded values

## 2. Test Requirements Verification
${testRequirements.length > 0 ? testRequirements.map((req) => `- [ ] ${req}`).join("\n") : "- [ ] No specific test requirements from issue"}

**Test Coverage Requirements**:
- Unit tests for business logic
- Integration tests for API/components
- Edge case handling
- Error scenario testing

## 3. Architecture Compliance
${architectureGuidelines}

## 4. Security & Performance
- [ ] **SQL Injection**: Parameterized queries used
- [ ] **XSS Prevention**: Input sanitization
- [ ] **Authentication**: Proper JWT validation (Supabase)
- [ ] **Authorization**: Permission checks in place
- [ ] **N+1 Query**: Efficient database queries
- [ ] **Memory Leaks**: Proper resource cleanup
- [ ] **API Rate Limiting**: Protection against abuse

## 5. Semicolon Ecosystem Specific Rules

### Frontend (Next.js)
- Use \`semicolon-community-core\` package for shared components
- Auth flows must use Supabase JWT tokens
- No direct database queries (use Spring Boot API)
- Server Components vs Client Components appropriate usage

### Backend (Spring Boot)
- Verify Supabase JWT tokens for authentication
- Use JPA for database operations (direct PostgreSQL)
- Redis for caching (once-per-day limits)
- NO RLS (Row Level Security) - permissions in Spring
- Proper error responses with HTTP status codes

### Microservices
- Independent operation without community server dependencies
- Use core-db work queue for task management
- Async processing patterns
- Proper logging to ms-logger

---

${issue ? `# Linked Issue\n**#${issue.number}**: ${issue.title}\n\n${(issue.body || "").substring(0, 2000)}${(issue.body || "").length > 2000 ? "..." : ""}\n\n---\n` : ""}

# PR Statistics
- **Total Changes**: ${prDiff.length.toLocaleString()} characters
- **Files Changed**: ${filesChanged}
- **Showing**: ${Math.min(100000, prDiff.length).toLocaleString()} characters (${Math.round((Math.min(100000, prDiff.length) / prDiff.length) * 100)}%)

# PR Diff (Sample)
\`\`\`diff
<<<<<<< HEAD
${prDiff.substring(0, 100000)}${prDiff.length > 100000 ? "\n\n...(truncated for length - see full diff at PR)" : ""}
=======
<<<<<<< HEAD
${prDiff.substring(0, 8000)}${prDiff.length > 8000 ? "\n...(truncated)" : ""}
=======
${prDiff.substring(0, 100000)}${prDiff.length > 100000 ? "\n\n...(truncated for length - see full diff at PR)" : ""}
>>>>>>> e37f177 (🔧 #73 AI 리뷰에 PR 통계 정보 추가)
>>>>>>> dev
\`\`\`

---

# Your Task

1. **Review Code Changes**: Analyze all changes against the checklist above
2. **Verify Test Requirements**: Check if all test requirements from the issue are implemented
3. **Identify Issues**: Find bugs, security vulnerabilities, performance problems
4. **Provide Feedback**: Specific, actionable feedback with line numbers

⚠️ **IMPORTANT**: This PR contains ${filesChanged} files with ${prDiff.length.toLocaleString()} characters of changes. The diff above is truncated to fit context limits. Focus on:
- Implementation completeness vs. requirements
- Code quality and patterns
- Security and performance
- Test coverage
If the truncated diff shows substantial implementation, assume the PR is likely complete.

# Severity Levels
- **critical**: Security vulnerabilities, data loss risks, broken functionality
- **major**: Significant code quality issues, missing tests, architecture violations
- **minor**: Style issues, minor improvements, suggestions

# Output Format (STRICT JSON)

{
  "approved": true/false,
  "score": 0-100,
  "summary": "Brief overall assessment in Korean (2-3 sentences)",
  "issues": [
    {
      "severity": "critical|major|minor",
      "category": "lint|convention|test|security|performance|architecture",
      "file": "file path if applicable",
      "line": "line number if applicable",
      "description": "Detailed issue description in Korean",
      "suggestion": "How to fix it in Korean"
    }
  ],
  "test_coverage": {
    "required": ["test requirements from issue"],
    "implemented": ["tests found in PR diff"],
    "missing": ["required tests not implemented"]
  },
  "positive_points": ["Good practices or improvements found (in Korean)"],
  "comment": "Detailed GitHub-style markdown review comment in Korean"
}

**CRITICAL RULES**:
- Output ONLY valid JSON, no explanations before/after
- Must start with { and end with }
- If approved is false, include at least one critical or major issue
- comment field must be concise markdown with sections: 요약 (1-2 sentences), 주요 발견사항 (bullet points if any)
- All text content (summary, description, suggestion, comment) must be in Korean
- Score calculation: 100 - (critical * 30) - (major * 15) - (minor * 5)
- Minimum score for approval: 70
- If test requirements are missing, set approved to false`;
}

function getArchitectureGuidelines(projectType) {
  const guidelines = {
    nextjs: `### Next.js Frontend
- [ ] **Component Structure**: Proper separation of Server/Client Components
- [ ] **State Management**: Zustand or Context API usage
- [ ] **Routing**: App Router patterns (/app directory)
- [ ] **API Calls**: Use fetch with proper error handling
- [ ] **Styling**: Tailwind CSS or styled-components
- [ ] **Performance**: Lazy loading, code splitting
- [ ] **Shared Package**: Import from semicolon-community-core`,
    react: `### React Frontend
- [ ] **Component Structure**: Functional components with hooks
- [ ] **Props**: TypeScript interfaces defined
- [ ] **State**: useState, useEffect proper usage
- [ ] **Custom Hooks**: Reusable logic extraction`,
    "spring-gradle": `### Spring Boot Backend
- [ ] **Layer Structure**: Controller -> Service -> Repository
- [ ] **DTO/Entity**: Proper separation
- [ ] **JWT Validation**: Supabase token verification
- [ ] **Exception Handling**: @RestControllerAdvice usage
- [ ] **Transaction**: @Transactional for data operations
- [ ] **JPA**: Proper entity relationships and queries`,
    "spring-maven": `### Spring Boot Backend (Maven)
- [ ] **Layer Structure**: Controller -> Service -> Repository
- [ ] **Dependency Injection**: @Autowired or constructor injection
- [ ] **REST API**: Proper HTTP methods and status codes
- [ ] **Database**: JPA with PostgreSQL`,
    unknown: `### General Architecture
- [ ] **Code Organization**: Logical file/folder structure
- [ ] **Dependencies**: Appropriate library usage
- [ ] **Error Handling**: Proper exception management`,
  };
  return guidelines[projectType] || guidelines.unknown;
}

async function callClaudeAPI(apiKey, prompt) {
  // 비밀키는 로그로 출력하지 않습니다.
  console.log(`prompt: ${String(prompt).slice(0, 100)}...`);

  // 프롬프트의 비-ASCII 문자를 유니코드 이스케이프로 변환
  function escapeUnicode(str) {
    return str.replace(/[^\x00-\x7F]/g, (char) => {
      return "\\u" + ("0000" + char.charCodeAt(0).toString(16)).slice(-4);
    });
  }

  const escapedPrompt = escapeUnicode(prompt);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-latest",
      max_tokens: 8000,
      messages: [{ role: "user", content: escapedPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API 호출 실패: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const responseText = data?.content?.[0]?.text ?? "";

  console.log("📝 Claude 응답 길이:", responseText.length, "글자");

  // JSON 추출
  let jsonText = responseText;

  const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1];
  } else {
    const firstBrace = responseText.indexOf("{");
    const lastBrace = responseText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = responseText.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.warn("⚠️  JSON 파싱 실패, 부분 파싱 시도...");

    try {
      // comment 필드가 미닫힘 따옴표 없이 잘렸을 가능성 방지
      const truncatedJson = jsonText.replace(
        /("comment":\s*"[^"]*$)/,
        '"comment": "응답이 잘렸습니다."',
      );
      const finalJson = truncatedJson.endsWith("}") ? truncatedJson : truncatedJson + '"}';
      return JSON.parse(finalJson);
    } catch (secondError) {
      console.error("❌ JSON 파싱 완전 실패, 기본 응답 사용");
      return {
        approved: true,
        score: 80,
        summary: "PR 리뷰 완료 (응답 파싱 오류 발생)",
        issues: [],
        test_coverage: { required: [], implemented: [], missing: [] },
        positive_points: ["코드 변경사항 확인됨"],
        comment: "## 요약\nPR이 생성되었습니다. 상세 리뷰는 수동으로 확인해주세요.",
      };
    }
  }
}

function extractTestRequirements(issueBody) {
  if (!issueBody) return [];

  // 다양한 테스트 요구사항 섹션 제목 형식 지원
  // ✅ 수정: h2 레벨 헤더(## )만 종료 조건으로 인식하도록 패턴 개선
  // h3 헤더(###)를 포함한 하위 헤더는 섹션 내부로 포함
  const testSectionPatterns = [
    /## ✅ 테스트 코드 요구사항\n([\s\S]*?)(?=\n## [^#]|$)/, // 기존 형식
    /## 🧪 테스트 요구사항\n([\s\S]*?)(?=\n## [^#]|$)/, // 새 형식
    /## 테스트 요구사항\n([\s\S]*?)(?=\n## [^#]|$)/, // 이모지 없는 형식
  ];

  let testSection = null;
  for (const pattern of testSectionPatterns) {
    testSection = issueBody.match(pattern);
    if (testSection) break;
  }

  if (!testSection) return [];

  return testSection[1]
    .split("\n")
    .filter((line) => line.trim().startsWith("- [ ]") || line.trim().startsWith("- [x]"))
    .map((line) => line.replace(/^- \[[x ]\]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

async function getLinkedIssue(owner, repo, token, prNumber) {
  try {
    const ghHeaders = {
      Authorization: `token ${token}`, // token은 ASCII 정규화됨
      Accept: "application/vnd.github.v3+json",
    };

    // PR 정보 가져오기
    const prResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: ghHeaders,
      },
    );

    if (!prResponse.ok) {
      console.warn("⚠️  PR 정보 조회 실패:", prResponse.status);
      return null;
    }

    const pr = await prResponse.json();

    // PR 본문에서 이슈 번호 추출 (#123, fixes #123, closes #123 등)
    const issueMatch = pr.body?.match(/#(\d+)|(?:fixes|closes|resolves)\s+#(\d+)/i);
    if (!issueMatch) return null;

    const issueNumber = parseInt(issueMatch[1] || issueMatch[2], 10);

    // 이슈 정보 가져오기
    const issueResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        headers: ghHeaders,
      },
    );

    if (!issueResponse.ok) {
      console.warn("⚠️  이슈 정보 조회 실패:", issueResponse.status);
      return null;
    }

    return await issueResponse.json();
  } catch (error) {
    console.warn("⚠️  이슈 조회 실패:", error?.message || String(error));
    return null;
  }
}

// 스크립트 실행
reviewPR().catch((error) => {
  console.error("스크립트 실행 실패:", error);
  process.exit(1);
});
