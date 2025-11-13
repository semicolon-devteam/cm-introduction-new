// Bug Task GitHub Issues 자동 생성 스크립트
import * as github from "@actions/github";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATE_FILES = {
  bug_fix: "bug_report.md",
  test_qa: "test_qa.md",
  documentation: "documentation.md",
  refactor: "refactor.md",
  quick_fix: "quick_fix.md",
};

// 레포지토리의 모든 라벨 조회
async function getRepositoryLabels(octokit, owner, repo) {
  try {
    const { data: labels } = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo,
      per_page: 100,
    });

    return labels.map((l) => l.name);
  } catch (error) {
    console.error("❌ 라벨 조회 실패:", error.message);
    return [];
  }
}

async function createBugTasks() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const targetRepo = process.env.TARGET_REPO;
    const bugNumber = parseInt(process.env.BUG_NUMBER);
    const bugTitle = process.env.BUG_TITLE;
    const autoAssign = process.env.AUTO_ASSIGN === "true";

    if (!token || !targetRepo || !bugNumber) {
      throw new Error("필수 환경 변수가 설정되지 않았습니다.");
    }

    console.log("🚀 Bug Task Issue 생성 시작");
    console.log("- 타겟 레포:", targetRepo);
    console.log("- Bug 번호:", bugNumber);
    console.log("- 자동 할당:", autoAssign);

    const octokit = github.getOctokit(token);
    const owner = "semicolon-devteam";

    // 레포지토리 라벨 조회
    console.log("📋 레포지토리 라벨 조회 중...");
    const availableLabels = await getRepositoryLabels(octokit, owner, targetRepo);
    console.log(`✅ 라벨 ${availableLabels.length}개 조회 완료`);

    const workflowRoot = path.join(__dirname, "..", "..");
    const tasksPath = path.join(workflowRoot, "bug-tasks-output.json");

    if (!fs.existsSync(tasksPath)) {
      throw new Error(`bug-tasks-output.json 파일을 찾을 수 없습니다: ${tasksPath}`);
    }

    const tasksData = JSON.parse(fs.readFileSync(tasksPath, "utf8"));
    const tasks = tasksData.tasks || [];
    const analysis = tasksData.analysis_summary || "";
    const severityAssessment = tasksData.severity_assessment || {};

    console.log(`📋 생성할 Task 개수: ${tasks.length}개`);
    console.log(`📊 분석 요약: ${analysis}`);
    console.log(`⚠️  우선순위: ${severityAssessment.calculated_priority}`);
    console.log("");

    if (tasks.length === 0) {
      console.warn("⚠️  생성할 Task가 없습니다.");
      return;
    }

    const results = {
      success: 0,
      failed: 0,
      issues: [],
      errors: [],
    };

    // 원본 Bug 이슈에 분석 결과 코멘트 추가
    try {
      const analysisComment = generateAnalysisComment(tasksData, bugTitle);
      await octokit.rest.issues.createComment({
        owner,
        repo: targetRepo,
        issue_number: bugNumber,
        body: analysisComment,
      });
      console.log(`✅ Bug 이슈 #${bugNumber}에 분석 결과 코멘트 추가 완료\n`);
    } catch (error) {
      console.error(`❌ 분석 코멘트 추가 실패: ${error.message}\n`);
    }

    // 우선순위 순으로 정렬
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4 };
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    });

    const createdIssueNumbers = [];

    for (const task of sortedTasks) {
      try {
        console.log(`🔨 [${task.priority}] Task 생성 중: ${task.title}`);

        const issueBody = generateBugTaskBody(task, bugNumber, bugTitle, createdIssueNumbers);

        // 라벨 필터링 (존재하는 라벨만)
        const requestedLabels = task.labels || [];
        const validLabels = requestedLabels.filter((label) => availableLabels.includes(label));

        if (requestedLabels.length !== validLabels.length) {
          const missingLabels = requestedLabels.filter((label) => !availableLabels.includes(label));
          console.log(`  ⚠️  존재하지 않는 라벨 제외: ${missingLabels.join(", ")}`);
        }

        console.log(`  📌 적용할 라벨: ${validLabels.join(", ")}`);

        const createParams = {
          owner,
          repo: targetRepo,
          title: task.title,
          body: issueBody,
          labels: validLabels,
        };

        const { data: issue } = await octokit.rest.issues.create(createParams);

        console.log(`  ✅ Issue 생성 성공: #${issue.number}`);
        createdIssueNumbers.push(issue.number);

        results.success++;
        results.issues.push({
          number: issue.number,
          title: task.title,
          url: issue.html_url,
          priority: task.priority,
        });

        // API Rate Limit 고려 (0.5초 대기)
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Task 생성 실패: ${task.title}`);
        console.error(`  오류: ${error.message}`);
        results.failed++;
        results.errors.push({
          task: task.title,
          error: error.message,
        });
      }
    }

    // 원본 Bug 이슈에 생성된 Task 링크 추가
    if (createdIssueNumbers.length > 0) {
      try {
        const taskLinksComment = generateTaskLinksComment(results.issues);
        await octokit.rest.issues.createComment({
          owner,
          repo: targetRepo,
          issue_number: bugNumber,
          body: taskLinksComment,
        });
        console.log(`\n✅ Bug 이슈에 생성된 Task 링크 추가 완료`);
      } catch (error) {
        console.error(`❌ Task 링크 추가 실패: ${error.message}`);
      }
    }

    // 결과 저장
    fs.writeFileSync("created-bug-tasks.json", JSON.stringify(results, null, 2));
    console.log("\n💾 결과 저장 완료: created-bug-tasks.json");

    console.log("\n📊 최종 결과:");
    console.log(`✅ 성공: ${results.success}개`);
    console.log(`❌ 실패: ${results.failed}개`);

    if (results.issues.length > 0) {
      console.log("\n생성된 Issues:");
      results.issues.forEach((issue) => {
        console.log(`  [${issue.priority}] #${issue.number} - ${issue.title}`);
        console.log(`    ${issue.url}`);
      });
    }

    if (results.failed > 0) {
      throw new Error(`${results.failed}개의 Task 생성에 실패했습니다.`);
    }
  } catch (error) {
    console.error("❌ Bug Task 생성 실패:", error.message);
    console.error("스택:", error.stack);
    process.exit(1);
  }
}

function generateAnalysisComment(tasksData, bugTitle) {
  const { analysis_summary, root_cause_hypothesis, severity_assessment, estimated_total_effort } =
    tasksData;

  return `## 🤖 AI 버그 분석 결과

### 📊 분석 요약
${analysis_summary}

### 🔍 추정되는 근본 원인
${root_cause_hypothesis.map((cause, i) => `${i + 1}. ${cause}`).join("\n")}

### ⚠️ 심각도 평가
- **우선순위**: ${severity_assessment.calculated_priority}
- **SLA**: ${severity_assessment.sla}
- **영향도**: ${severity_assessment.impact}

### ⏱️ 예상 작업량
${estimated_total_effort}

---

💡 위 분석을 기반으로 수정 작업(Task)이 자동으로 생성됩니다.

_🤖 Generated by Claude AI Bug Analyzer_
`;
}

function generateTaskLinksComment(issues) {
  const issueList = issues
    .map((issue) => `- [${issue.priority}] #${issue.number} - ${issue.title}`)
    .join("\n");

  return `## 🔗 생성된 수정 작업(Tasks)

이 버그를 해결하기 위해 다음 작업들이 생성되었습니다:

${issueList}

---

💡 각 Task를 순서대로 진행하여 버그를 해결해주세요.

_🤖 Generated by Bug to Tasks Generator_
`;
}

function generateBugTaskBody(task, bugNumber, bugTitle, previousIssueNumbers) {
  const technicalDetails = task.technical_details || {};
  const affectedFiles = technicalDetails.affected_files || [];
  const requirements = technicalDetails.requirements || [];
  const testRequirements = technicalDetails.test_requirements || [];

  let body = `## 🐛 원본 버그 리포트
**관련 이슈**: #${bugNumber} - ${bugTitle}

## 📋 작업 설명
${task.description}

## 💡 작업 근거
${task.rationale}

`;

  if (affectedFiles.length > 0) {
    body += `## 📂 영향받는 파일
${affectedFiles.map((file) => `- \`${file}\``).join("\n")}

`;
  }

  if (requirements.length > 0) {
    body += `## ✅ 구현 요구사항
${requirements.map((req) => `- [ ] ${req}`).join("\n")}

`;
  }

  if (testRequirements.length > 0) {
    body += `## 🧪 테스트 요구사항
${testRequirements.map((test) => `- [ ] ${test}`).join("\n")}

`;
  }

  body += `## 📊 작업량 평가
**예상 작업량**: ${task.estimated_points} Story Points

## ⚠️ 우선순위
**Priority**: ${task.priority}
**Urgency**: ${task.urgency}

`;

  if (previousIssueNumbers.length > 0) {
    body += `## 🔗 관련 작업
${previousIssueNumbers.map((num) => `- #${num}`).join("\n")}

`;
  }

  body += `---
_🤖 Generated by Bug to Tasks Generator from Bug #${bugNumber}_
`;

  return body;
}

// 스크립트 실행
createBugTasks().catch((error) => {
  console.error("스크립트 실행 실패:", error);
  process.exit(1);
});
