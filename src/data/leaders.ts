import { Leader } from "@/models/leader";

export const leaders: Leader[] = [
  {
    id: "1",
    slug: "garden",
    name: "서정원",
    nickname: "Garden",
    position: "시스템 아키텍트",
    profileImage: "/images/leaders/leader-1.png",
    skills: ["시스템 아키텍처", "기술 통합 리드"],
    oneLiner: "고객과 시스템 사이, 최적의 구조를 설계합니다.",
    professionalHistory: [
      "명지전문대학교 컴퓨터공학과 졸업",
      "10년 차 인프라 엔지니어",
      "KT DS 백엔드 개발 기술자 재직",
      "풀스택 개발",
    ],
    philosophy:
      '어떤 기술적 해결책보다 먼저 "사람의 이야기를 들을 것"을 가장 중요하게 생각한다. 팀과 고객 모두의 관점을 이해하려는 태도를 기반으로 문제를 정의하고, 그 위에 구조적 해결책을 설계한다. 기술은 사람을 불편하게 해서는 안 된다는 확고한 철학을 가지고 있다.',
    workAreas: [
      "Supabase 기반 인프라 구조 설계",
      "성능 최적화 및 확장성 개선",
      "기술 통합 및 시스템 운영 고도화",
      "장애 대응 시스템 구축",
    ],
    technicalSkills: [
      { name: "인프라", level: 5 },
      { name: "백엔드", level: 4 },
      { name: "DevOps", level: 5 },
      { name: "보안", level: 4 },
      { name: "데이터베이스", level: 4 },
    ],
    projects: [
      {
        year: "2025",
        name: "커뮤니티 플랫폼",
        tags: ["Supabase", "Next.js", "TypeScript"],
        description:
          "우리는 AI를 적극 활용해 일반 팀 대비 3-5배 빠른 개발 속도를 자랑합니다. 하지만 속도만으로는 부족합니다. AI 도구가 해결하지 못하는 복잡한 아키텍처 문제, 예상치 못한 버그, 성능 최적화... 이런 순간에 필요한 것은 검증된 기술력입니다.",
      },
      {
        year: "2024",
        name: "실시간 모니터링 시스템",
        tags: ["Grafana", "Prometheus", "Docker"],
        description: "대규모 인프라 모니터링 및 알림 시스템 구축",
      },
      {
        year: "2023",
        name: "데이터 파이프라인",
        tags: ["Airflow", "Spark", "AWS"],
        description: "대용량 데이터 ETL 파이프라인 설계 및 구현",
      },
    ],
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "2",
    slug: "reus",
    name: "전준영",
    nickname: "Reus",
    position: "프론트엔드 리드",
    profileImage: "/images/leaders/leader-2.png",
    skills: ["프론트 리드 엔지니어", "협업 매니저"],
    oneLiner: "사용자 경험을 최우선으로 생각하며 팀과 함께 성장합니다.",
    professionalHistory: [
      "프론트엔드 개발 5년 차",
      "React/Next.js 전문가",
      "UI/UX 최적화 경험 다수",
      "팀 리딩 및 멘토링",
    ],
    philosophy:
      "좋은 개발자는 혼자 잘하는 사람이 아니라, 팀 전체를 성장시킬 수 있는 사람입니다. 기술적 탁월함과 협업 능력이 함께 있을 때 진정한 가치를 만들어낼 수 있습니다.",
    workAreas: [
      "React/Next.js 기반 웹 애플리케이션 개발",
      "컴포넌트 아키텍처 설계",
      "성능 최적화 및 번들 사이즈 관리",
      "프론트엔드 팀 리딩 및 코드 리뷰",
    ],
    technicalSkills: [
      { name: "React", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Next.js", level: 5 },
      { name: "CSS/UI", level: 4 },
      { name: "테스트", level: 4 },
    ],
    projects: [
      {
        year: "2025",
        name: "팀 소개 사이트",
        tags: ["Next.js", "Tailwind CSS", "Figma"],
        description: "Semicolon 팀을 소개하는 공식 웹사이트 프론트엔드 개발 및 인터랙션 구현",
      },
      {
        year: "2024",
        name: "커뮤니티 대시보드",
        tags: ["React", "Chart.js", "Recoil"],
        description: "실시간 데이터 시각화 대시보드 및 관리자 페이지 구현",
      },
      {
        year: "2023",
        name: "이커머스 플랫폼",
        tags: ["Next.js", "Redux", "Stripe"],
        description: "결제 시스템 통합 및 상품 관리 프론트엔드 아키텍처 설계",
      },
    ],
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "3",
    slug: "roki",
    name: "노영록",
    nickname: "Roki",
    position: "서비스 총괄",
    profileImage: "/images/leaders/leader-3.png",
    skills: ["서비스총괄", "그로스 디렉터"],
    oneLiner: "데이터 기반 의사결정으로 서비스를 성장시킵니다.",
    professionalHistory: [
      "프로덕트 매니저 경력 7년",
      "스타트업 서비스 론칭 경험 다수",
      "데이터 분석 및 그로스 해킹 전문가",
    ],
    philosophy:
      "숫자는 거짓말을 하지 않습니다. 사용자의 행동 데이터를 면밀히 분석하고, 가설을 세우고, 실험하고, 검증하는 과정을 반복하며 서비스를 개선해 나갑니다.",
    workAreas: [
      "서비스 기획 및 로드맵 수립",
      "데이터 분석 및 인사이트 도출",
      "사용자 피드백 수집 및 개선 방향 설정",
      "팀 간 커뮤니케이션 조율",
    ],
    technicalSkills: [
      { name: "기획", level: 5 },
      { name: "데이터분석", level: 5 },
      { name: "UX리서치", level: 4 },
      { name: "그로스해킹", level: 5 },
      { name: "커뮤니케이션", level: 5 },
    ],
    projects: [
      {
        year: "2025",
        name: "커뮤니티 그로스 전략",
        tags: ["Product", "A/B Test", "Funnel"],
        description: "사용자 여정 분석을 통한 전환율 40% 개선 프로젝트 총괄",
      },
      {
        year: "2024",
        name: "사용자 참여 플랫폼",
        tags: ["Analytics", "Retention", "Growth"],
        description: "사용자 참여도를 3배 향상시킨 커뮤니티 기능 기획 및 론칭",
      },
      {
        year: "2023",
        name: "신규 서비스 런칭",
        tags: ["GTM", "User Research", "MVP"],
        description: "신규 서비스 PMF 검증 및 초기 사용자 1만 명 확보 전략 수립",
      },
    ],
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "4",
    slug: "kyago",
    name: "강용준",
    nickname: "Kyago",
    position: "백엔드 총괄",
    profileImage: "/images/leaders/leader-4.png",
    skills: ["백엔드 총괄", "기술 솔루션 리드"],
    oneLiner: "안정적이고 확장 가능한 시스템을 설계합니다.",
    professionalHistory: [
      "백엔드 개발 8년 차",
      "대용량 트래픽 처리 경험",
      "마이크로서비스 아키텍처 설계 및 구현",
      "DevOps 및 인프라 관리",
    ],
    philosophy:
      "좋은 코드는 지금 당장 동작하는 코드가 아니라, 3년 후에도 유지보수가 가능한 코드입니다. 확장성과 안정성을 고려한 설계가 장기적으로 팀과 서비스에 가치를 줍니다.",
    workAreas: [
      "백엔드 API 설계 및 구현",
      "데이터베이스 스키마 설계 및 최적화",
      "서버 인프라 구축 및 관리",
      "보안 및 성능 최적화",
    ],
    technicalSkills: [
      { name: "Java/Spring", level: 5 },
      { name: "데이터베이스", level: 5 },
      { name: "시스템설계", level: 5 },
      { name: "DevOps", level: 4 },
      { name: "보안", level: 4 },
    ],
    projects: [
      {
        year: "2025",
        name: "API Gateway 고도화",
        tags: ["Spring Cloud", "Kong", "OAuth2"],
        description: "마이크로서비스 간 통신 최적화 및 인증/인가 시스템 재설계",
      },
      {
        year: "2024",
        name: "실시간 알림 시스템",
        tags: ["Spring Boot", "Redis", "WebSocket"],
        description: "100만 사용자를 위한 실시간 알림 시스템 구축 및 운영",
      },
      {
        year: "2023",
        name: "결제 시스템 리팩토링",
        tags: ["Java", "PostgreSQL", "Kafka"],
        description: "레거시 결제 시스템을 이벤트 기반 아키텍처로 전환",
      },
    ],
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "5",
    slug: "yeomso",
    name: "염현준",
    nickname: "Yeomso",
    position: "디자인 리드",
    profileImage: "/images/leaders/leader-5.png",
    skills: ["디자인 리드", "UX 전략"],
    oneLiner: "사용자 중심의 직관적인 경험을 디자인합니다.",
    professionalHistory: [
      "UI/UX 디자이너 6년 차",
      "브랜딩 및 프로덕트 디자인 전문",
      "사용자 리서치 및 인터뷰 경험 다수",
      "디자인 시스템 구축 및 운영",
    ],
    philosophy:
      "디자인은 문제 해결의 도구입니다. 아름다움은 기본이고, 사용자가 목표를 달성하는 데 방해가 되지 않는 것이 진정한 좋은 디자인이라고 생각합니다.",
    workAreas: [
      "UI/UX 디자인 및 프로토타이핑",
      "디자인 시스템 구축 및 관리",
      "사용자 리서치 및 인터뷰",
      "브랜딩 및 비주얼 아이덴티티",
    ],
    technicalSkills: [
      { name: "UI디자인", level: 5 },
      { name: "UX리서치", level: 5 },
      { name: "프로토타이핑", level: 5 },
      { name: "디자인시스템", level: 4 },
      { name: "브랜딩", level: 4 },
    ],
    projects: [
      {
        year: "2025",
        name: "팀 소개 사이트 디자인",
        tags: ["Figma", "UI/UX", "Branding"],
        description: "Semicolon 브랜드 아이덴티티와 웹사이트 전체 디자인 총괄",
      },
      {
        year: "2024",
        name: "디자인 시스템 구축",
        tags: ["Design System", "Storybook", "Tokens"],
        description: "일관된 사용자 경험을 위한 컴포넌트 기반 디자인 시스템 구축",
      },
      {
        year: "2023",
        name: "모바일 앱 리디자인",
        tags: ["Mobile", "Prototyping", "User Test"],
        description: "사용성 테스트 기반 모바일 앱 UI/UX 개선 및 전환율 25% 향상",
      },
    ],
    isActive: true,
    displayOrder: 5,
  },
];

// Helper functions
export function getAllLeaders(): Leader[] {
  return leaders.filter((leader) => leader.isActive);
}

export function getLeaderBySlug(slug: string): Leader | undefined {
  return leaders.find((leader) => leader.slug === slug && leader.isActive);
}

export function getOtherLeaders(currentSlug: string): Leader[] {
  return leaders.filter((leader) => leader.slug !== currentSlug && leader.isActive);
}
