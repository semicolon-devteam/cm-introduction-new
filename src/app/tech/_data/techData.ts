import {
  Code,
  TestTube,
  FileText,
  Bug,
  Zap,
  Settings,
  Shield,
  Database,
  Monitor,
  Clock,
  Target,
} from "lucide-react";

// Win-Win 파트너십 데이터
export const winWinData = {
  client: {
    title: "클라이언트 혜택",
    items: ["빠른 개발 속도", "저렴한 가격", "고품질 산출물"],
  },
  semicolon: {
    title: "세미콜론 혜택",
    items: ["포트폴리오 구축", "실험 데이터 확보", "레퍼런스 축적"],
  },
};

// 경쟁력 비교 데이터
export const comparisonData = {
  smallCompany: {
    title: "중소기업/스타트업 대비",
    items: [
      "높은 비율의 엔지니어 리드 팀 구성",
      "속도와 기술력을 동시에 확보",
      "빠른 의사결정과 즉각적인 실행",
    ],
  },
  largeCompany: {
    title: "중견기업/대기업 대비",
    items: [
      "느린 의사결정 없는 빠른 실행력",
      "AI 기술을 이미 적극 활용 중",
      "혁신적인 솔루션 빠른 적용",
    ],
  },
};

// 클라이언트 가치 제안 데이터
export const clientValues = [
  {
    icon: Database,
    title: "최고의 가성비",
    description: "초기 단계 팀으로 저렴한 가격에 고품질 서비스 제공",
    detail:
      "당사는 포트폴리오와 실험 데이터를, 클라이언트는 빠르고 저렴한 산출물을 가져가는 Win-Win 관계",
  },
  {
    icon: Monitor,
    title: "엔지니어 직접 소통",
    description: "전문 엔지니어가 직접 미팅 참여 및 솔루션 설계",
    detail: "클라이언트의 페인포인트를 정확히 이해하고 최적의 소프트웨어 솔루션 제공",
  },
  {
    icon: Clock,
    title: "빠른 개발 속도",
    description: "AI 활용으로 일반 팀 대비 3-5배 빠른 개발",
    detail: "압도적인 생산성으로 빠른 시장 진입과 비용 절감 동시 달성",
  },
  {
    icon: Target,
    title: "정확한 요구사항 구현",
    description: "엔지니어 직접 소통으로 잘못된 산출물 발생 최소화",
    detail: "기술적 이해도가 높은 커뮤니케이션으로 정확한 결과물 보장",
  },
];

// 핵심 역량 데이터
export const coreSkills = [
  "Full-Stack",
  "Architecture",
  "AI/ML",
  "DevOps",
  "Performance",
  "Database",
];

// 통계 데이터
export const stats = [
  { value: "100+", label: "프로젝트" },
  { value: "100만+", label: "DAU" },
  { value: "24/7", label: "지원" },
];

// AI 활용 사례 데이터
export const aiUseCases = [
  {
    icon: Code,
    title: "AI 코드 리뷰 자동화",
    description: "코드 품질을 자동으로 검토하고 개선점을 제안합니다",
    badge: "300% 생산성 향상",
  },
  {
    icon: TestTube,
    title: "AI 기반 테스트 생성",
    description: "테스트 케이스를 자동으로 생성하여 품질을 보장합니다",
    badge: "테스트 커버리지 90% 달성",
  },
  {
    icon: FileText,
    title: "AI 문서 자동화",
    description: "코드 문서화를 자동으로 생성하고 관리합니다",
    badge: "문서화 시간 80% 절감",
  },
  {
    icon: Bug,
    title: "AI 디버깅 어시스턴트",
    description: "버그를 빠르게 탐지하고 해결책을 제안합니다",
    badge: "디버깅 시간 60% 단축",
  },
];

// 기술력 카드 데이터
export const techCards = [
  {
    icon: Zap,
    title: "검증된 기술 리더십",
    description: "AI를 적극 활용해 개발 속도를 3-5배 향상시켰습니다",
    badge: "300% 생산성 향상",
  },
  {
    icon: Settings,
    title: "고수준 엔지니어링",
    description: "AI 의존도가 높은 팀 대비 트러블슈팅과 위기 대처 능력 보유",
    badge: "리드 엔지니어 직접 참여",
  },
  {
    icon: Shield,
    title: "검증된 기술력",
    description: "AI 미활용 시에도 뛰어난 개발 역량으로 안정적인 결과물 보장",
    badge: "100+ 프로젝트 완료",
  },
];
