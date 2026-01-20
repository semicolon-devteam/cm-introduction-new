import { MessageCircle, BookOpen, Clock } from "lucide-react";

export const cultureItems = [
  {
    icon: MessageCircle,
    title: "수평적 소통",
    description: "직급과 상관없이 누구나 자유롭게\n의견을 나누고 존중받습니다.",
  },
  {
    icon: BookOpen,
    title: "성장 지원",
    description: "교육비 지원, 컨퍼런스 참석 등\n개인의 성장을 적극 지원합니다.",
  },
  {
    icon: Clock,
    title: "워라밸",
    description: "유연 근무제와 재택근무로\n일과 삶의 균형을 지킵니다.",
  },
];

export const memberCategories = [
  {
    title: "개발자",
    members: [
      {
        nickname: "Bon",
        role: "프론트엔드 개발",
        company: "카카오 · 개발팀",
        experience: "#경력 8년",
      },
      {
        nickname: "Dwaigt",
        role: "프론트엔드 개발",
        company: "카카오 · 개발팀",
        experience: "#경력 8년",
      },
    ],
  },
  {
    title: "디자이너",
    members: [
      {
        nickname: "Yeon",
        role: "UI / UX 디자인",
        company: "카카오 · 개발팀",
        experience: "#경력 8년",
      },
    ],
  },
  {
    title: "솔루션",
    members: [
      { nickname: "Goni", role: "서비스운영", company: "카카오 · 개발팀", experience: "#경력 8년" },
    ],
  },
];

export const leaders = [
  {
    name: "서 정 원",
    nickname: "Garden",
    image: "/images/leaders/leader-1.png",
    roles: ["시스템 아키텍처", "기술 통합 리드"],
  },
  {
    name: "전 준 영",
    nickname: "Reus",
    image: "/images/leaders/leader-2.png",
    roles: ["프론트 리드 엔지니어", "협업 매니저"],
  },
  {
    name: "노 영 록",
    nickname: "Roki",
    image: "/images/leaders/leader-3.png",
    roles: ["서비스총괄", "그로스 디렉터"],
  },
  {
    name: "강 용 준",
    nickname: "Kyago",
    image: "/images/leaders/leader-4.png",
    roles: ["백엔드 리드", "기술 자문"],
  },
  {
    name: "염 현 준",
    nickname: "Yeomso",
    image: "/images/leaders/leader-5.png",
    roles: ["디자인 리드", "UX 전략"],
  },
];
