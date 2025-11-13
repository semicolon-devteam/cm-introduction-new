export interface Leader {
  id: string;
  slug: string; // URL에 사용될 식별자 (reus, garden, roki, kyago)
  name: string;
  nickname: string;
  position: string;
  profileImage: string;
  skills: string[];
  oneLiner: string; // 한 줄 소개
  professionalHistory: string[]; // 경력 사항
  philosophy: string; // 리더십 철학
  workAreas: string[]; // 주요 업무 영역
  projects: LeaderProject[];
  isActive: boolean;
  displayOrder?: number;
}

export interface LeaderProject {
  year: string;
  name: string;
  tags: string[];
  description: string;
}
