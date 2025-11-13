// Bug 분석 및 Task 생성 스크립트
import fs from "fs";

async function analyzeBug() {
  try {
    // 환경 변수에서 입력 받기
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;
    const targetRepo = process.env.TARGET_REPO;
    const bugTitle = process.env.BUG_TITLE;
    const bugNumber = process.env.BUG_NUMBER;
    const urgency = process.env.URGENCY;
    const frequency = process.env.FREQUENCY;
    const location = process.env.LOCATION;

    console.log("📥 입력 데이터 확인...");
    console.log("Bug Title:", bugTitle);
    console.log("Bug Number:", bugNumber);
    console.log("Target Repo:", targetRepo);
    console.log("Urgency:", urgency);
    console.log("Frequency:", frequency);
    console.log("Location:", location);

    // Bug body 읽기
    const bugBody = fs.readFileSync("bug-body.txt", "utf8");
    console.log("Bug Body 길이:", bugBody.length, "글자");

    // 프로젝트 타입 감지
    const projectType = detectProjectType();
    console.log("프로젝트 타입:", projectType);

    // 프롬프트 구성
    const prompt = buildBugAnalysisPrompt({
      bugTitle,
      bugBody,
      urgency,
      frequency,
      location,
      projectType,
      targetRepo,
    });

    console.log("\n🤖 Claude API 호출 중...");
    console.log("프롬프트 길이:", prompt.length, "글자");

    // Claude API 호출
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 8000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Claude API 응답 수신");

    const responseText = data.content[0].text;
    console.log("📝 Claude 응답 길이:", responseText.length, "글자");

    // JSON 파싱
    let tasksJson;
    try {
      let jsonText = responseText;

      // 1. ```json ``` 코드 블록 체크
      const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      } else {
        // 2. 순수 JSON 추출
        const firstBrace = responseText.indexOf("{");
        const lastBrace = responseText.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonText = responseText.substring(firstBrace, lastBrace + 1);
        }
      }

      tasksJson = JSON.parse(jsonText);
      console.log("✅ JSON 파싱 성공");
      console.log("생성된 Task 수:", tasksJson.tasks?.length || 0);
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", parseError.message);
      console.error("응답 내용:", responseText.substring(0, 500));
      throw new Error("Claude 응답을 파싱할 수 없습니다.");
    }

    // 결과 저장
    fs.writeFileSync("bug-tasks-output.json", JSON.stringify(tasksJson, null, 2));
    console.log("💾 결과 저장 완료: bug-tasks-output.json");

    // 요약 출력
    console.log("\n📊 생성된 Task 요약:");
    if (tasksJson.tasks && tasksJson.tasks.length > 0) {
      tasksJson.tasks.forEach((task, index) => {
        console.log(`${index + 1}. [${task.priority}] ${task.title}`);
        console.log(`   - 템플릿: ${task.template}`);
        console.log(`   - 작업량: ${task.estimated_points}점`);
        console.log(`   - 긴급도: ${task.urgency}`);
      });
    }
  } catch (error) {
    console.error("❌ Bug 분석 실패:", error.message);
    console.error("스택:", error.stack);
    process.exit(1);
  }
}

function detectProjectType() {
  if (fs.existsSync("package.json")) {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    if (pkg.dependencies?.next) return "nextjs";
    if (pkg.dependencies?.react) return "react";
    return "nodejs";
  }

  if (fs.existsSync("pom.xml")) return "spring-maven";
  if (fs.existsSync("build.gradle") || fs.existsSync("build.gradle.kts")) return "spring-gradle";

  return "unknown";
}

function buildBugAnalysisPrompt({
  bugTitle,
  bugBody,
  urgency,
  frequency,
  location,
  projectType,
  targetRepo,
}) {
  const urgencyMap = {
    critical: "🔥 긴급 (서비스 중단/심각한 오류)",
    high: "🚨 높음 (주요 기능 동작 불가)",
    medium: "⚡ 보통 (일부 기능 오류)",
    low: "📌 낮음 (불편하지만 사용 가능)",
  };

  const frequencyMap = {
    always: "항상 (100% 재현)",
    often: "자주 (50% 이상)",
    sometimes: "가끔 (50% 미만)",
    once: "한 번만 발생",
  };

  const locationMap = {
    web: "웹사이트",
    mobile: "모바일 앱",
    admin: "관리자 페이지",
    backend: "API/백엔드",
    unknown: "미상",
  };

  const projectContext = getProjectContext(projectType);

  return `You are a senior software engineer analyzing a bug report from the semicolon-ecosystem project.

# Bug Report Analysis

## Bug Information
- **Title**: ${bugTitle}
- **Repository**: ${targetRepo}
- **Project Type**: ${projectType}
- **Location**: ${locationMap[location] || location}
- **Urgency**: ${urgencyMap[urgency] || urgency}
- **Frequency**: ${frequencyMap[frequency] || frequency}

## Bug Description
${bugBody}

---

# Your Task

Analyze this bug report and generate actionable technical tasks for developers. The bug was reported by non-technical staff (operations/testing team) who described symptoms, not root causes.

## Analysis Steps

### 1. Root Cause Hypothesis
Based on the symptoms described, infer possible technical root causes:
- What could cause these symptoms?
- Is this a frontend, backend, or integration issue?
- What components/modules are likely affected?

### 2. Priority Calculation
Use this matrix to determine priority:

**Critical Urgency**:
- Always: P0 (Immediate - within 4 hours)
- Often: P0 (Immediate - within 4 hours)
- Sometimes: P1 (High - within 24 hours)
- Once: P2 (Medium - this week)

**High Urgency**:
- Always: P1 (High - within 24 hours)
- Often: P1 (High - within 24 hours)
- Sometimes: P2 (Medium - this week)
- Once: P3 (Low - next sprint)

**Medium/Low Urgency**: Scale down accordingly.

Current bug: **${urgency}** urgency, **${frequency}** frequency → Calculate priority.

### 3. Task Generation
Generate 1-3 specific technical tasks:
- Main bug fix task (always required)
- Testing/verification task (if needed)
- Documentation/prevention task (if applicable)

Each task should include:
- Concrete title describing the technical work
- Affected files/components (best guess)
- Implementation requirements
- Test scenarios
- Estimated story points (1, 2, 3, 5, 8, 13)

${projectContext}

---

# Output Format (STRICT JSON)

Return ONLY valid JSON in this exact format:

\`\`\`json
{
  "analysis_summary": "Brief technical analysis of what's wrong (2-3 sentences in Korean)",
  "root_cause_hypothesis": [
    "Possible cause 1 in Korean",
    "Possible cause 2 in Korean"
  ],
  "severity_assessment": {
    "calculated_priority": "P0|P1|P2|P3|P4",
    "sla": "Recommended response time in Korean",
    "impact": "Impact description in Korean"
  },
  "tasks": [
    {
      "title": "[Fix] Specific technical task title in Korean",
      "template": "bug_fix|test_qa|documentation|refactor",
      "priority": "P0|P1|P2|P3|P4",
      "urgency": "critical|high|medium|low",
      "estimated_points": 1-13,
      "description": "Detailed task description in Korean",
      "technical_details": {
        "affected_files": ["file1.tsx", "file2.ts"],
        "requirements": [
          "Requirement 1 in Korean",
          "Requirement 2 in Korean"
        ],
        "test_requirements": [
          "Test scenario 1 in Korean",
          "Test scenario 2 in Korean"
        ]
      },
      "labels": ["bug", "priority-label", "component-label"],
      "rationale": "Why this task is needed (Korean)"
    }
  ],
  "recommended_labels": ["bug", "high-priority", "frontend"],
  "estimated_total_effort": "Total effort summary in Korean"
}
\`\`\`

**CRITICAL RULES**:
- Output ONLY valid JSON, no explanations before/after
- Must start with { and end with }
- All Korean text fields must be in proper Korean
- Priority must match the urgency-frequency matrix
- Include at least 1 task, maximum 3 tasks
- Estimated points: use Fibonacci (1, 2, 3, 5, 8, 13)
- Template must be one of: bug_fix, test_qa, documentation, refactor
- Labels must be lowercase with hyphens

**Important Context**:
- Bug reporter is non-technical (operations/testing staff)
- They described symptoms, not technical causes
- Your analysis bridges their report to actionable dev tasks
- Be specific about files, components, and technical requirements
`;
}

function getProjectContext(projectType) {
  const contexts = {
    nextjs: `## Next.js Project Context
- **Framework**: Next.js 14+ with App Router
- **State Management**: Zustand or React Context
- **Styling**: Tailwind CSS
- **API**: REST API calls to Spring Boot backend
- **Auth**: Supabase JWT tokens
- **Common Issues**: Server/Client component confusion, hydration errors, API timeout

**Typical File Structure**:
- \`src/app/\` - Pages (App Router)
- \`src/components/\` - Reusable components
- \`src/stores/\` - Zustand stores
- \`src/api/\` - API client functions`,

    react: `## React Project Context
- **Framework**: React with hooks
- **State Management**: Context API or Zustand
- **Styling**: CSS Modules or styled-components
- **Common Issues**: State updates, useEffect dependencies, re-renders`,

    "spring-gradle": `## Spring Boot Project Context
- **Framework**: Spring Boot 3.x
- **Build**: Gradle
- **Database**: PostgreSQL with JPA
- **Auth**: Supabase JWT validation
- **Cache**: Redis
- **Common Issues**: N+1 queries, transaction management, JWT validation

**Typical File Structure**:
- \`src/main/java/.../controller/\` - REST Controllers
- \`src/main/java/.../service/\` - Business logic
- \`src/main/java/.../repository/\` - JPA Repositories
- \`src/main/java/.../entity/\` - JPA Entities`,

    "spring-maven": `## Spring Boot Project Context
- **Framework**: Spring Boot with Maven
- **Database**: JPA with PostgreSQL
- **Common Issues**: Dependency injection, REST endpoint errors`,

    unknown: `## General Project Context
- Analyze based on symptoms and common software issues
- Provide technology-agnostic solutions where possible`,
  };

  return contexts[projectType] || contexts.unknown;
}

// 스크립트 실행
analyzeBug().catch((error) => {
  console.error("스크립트 실행 실패:", error);
  process.exit(1);
});
