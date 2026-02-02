import Link from "next/link";
import Image from "next/image";

interface LeaderCardProps {
  slug: string;
  name: string;
  nickname: string;
  position: string;
  profileImage: string;
  skills?: string[];
}

export function LeaderCard({ slug, name, nickname, position, profileImage }: LeaderCardProps) {
  return (
    <Link
      href={`/leaders/${slug}`}
      className="group flex flex-col gap-4 transition-transform hover:scale-105"
    >
      {/* Profile Image */}
      <div className="relative w-full aspect-square rounded-8 overflow-hidden bg-brand-surface">
        <Image src={profileImage} alt={`${name} profile`} fill className="object-cover" />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/20 transition-colors" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-heading-3 font-bold text-brand-white">{name}</h3>
          <span className="text-body-2 text-gray-light">{nickname}</span>
        </div>
        <p className="text-body-2 text-brand-primary">{position}</p>
      </div>
    </Link>
  );
}
