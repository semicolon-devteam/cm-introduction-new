import { Leader } from "@/models/leader";

export const leaders: Leader[] = [
  {
    id: "1",
    slug: "garden",
    name: "서정원",
    nickname: "Garden",
    position: "시스템 아키텍트",
    profileImage: "/images/leaders/garden.png",
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
    projects: [
      {
        year: "2025",
        name: "커뮤니티 플랫폼",
        tags: ["Supabase", "Next.js", "TypeScript"],
        description: "실시간 소통이 가능한 커뮤니티 플랫폼 구축",
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
    profileImage: "/images/leaders/reus.png",
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
    projects: [
      {
        year: "2025",
        name: "팀 소개 사이트",
        tags: ["Next.js", "Tailwind CSS", "Figma"],
        description: "Semicolon 팀을 소개하는 공식 웹사이트",
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
    profileImage: "/images/leaders/roki.png",
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
    projects: [
      {
        year: "2024",
        name: "사용자 참여 플랫폼",
        tags: ["Product", "Analytics", "Growth"],
        description: "사용자 참여도를 3배 향상시킨 커뮤니티 기능 기획",
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
    profileImage: "/images/leaders/kyago.png",
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
    projects: [
      {
        year: "2024",
        name: "실시간 알림 시스템",
        tags: ["Spring Boot", "Redis", "WebSocket"],
        description: "100만 사용자를 위한 실시간 알림 시스템 구축",
      },
    ],
    isActive: true,
    displayOrder: 4,
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
