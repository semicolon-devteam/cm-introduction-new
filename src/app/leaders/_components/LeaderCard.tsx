"use client";

import Link from "next/link";
import Image from "next/image";

import type { Leader } from "../_repositories";

interface LeaderCardProps {
  leader: Leader;
}

export function LeaderCard({ leader }: LeaderCardProps) {
  return (
    <Link
      href={`/leaders/${leader.slug}`}
      className="group flex flex-col gap-4 transition-transform hover:scale-105"
    >
      {/* Profile Image */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
        {leader.profileImage ? (
          <Image
            src={leader.profileImage}
            alt={`${leader.name} profile`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-4xl text-gray-400">
              {leader.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Name and Position */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
          {leader.nickname && (
            <span className="text-sm text-gray-500">{leader.nickname}</span>
          )}
        </div>
        <p className="text-sm text-gray-600">{leader.position}</p>
      </div>

      {/* Skills */}
      {leader.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {leader.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
            >
              {skill}
            </span>
          ))}
          {leader.skills.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
              +{leader.skills.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
