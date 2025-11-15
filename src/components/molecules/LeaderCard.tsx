import Link from "next/link";
import Image from "next/image";

import { SkillBadge } from "@/components/atoms/SkillBadge";

interface LeaderCardProps {
  slug: string;
  name: string;
  nickname: string;
  profileImage: string;
  skills: string[];
}

export function LeaderCard({ slug, name, nickname, profileImage, skills }: LeaderCardProps) {
  return (
    <Link
      href={`/leaders/${slug}`}
      className="group flex flex-col gap-4 transition-transform hover:scale-105"
    >
      {/* Profile Image */}
      <div className="relative w-full aspect-square rounded-8 overflow-hidden bg-brand-surface">
        <Image src={profileImage} alt={`${name} profile`} fill className="object-cover" />
      </div>

      {/* Name and Nickname */}
      <div className="flex items-center gap-2">
        <h3 className="text-heading-3 font-bold text-brand-white">{name}</h3>
        <span className="text-body-2 text-gray-light">{nickname}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill}>{skill}</SkillBadge>
        ))}
      </div>
    </Link>
  );
}
