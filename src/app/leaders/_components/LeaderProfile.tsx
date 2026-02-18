"use client";

import Image from "next/image";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

import type { Leader } from "../_repositories";

interface LeaderProfileProps {
  leader: Leader;
}

export function LeaderProfile({ leader }: LeaderProfileProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {leader.profileImage ? (
            <Image
              src={leader.profileImage}
              alt={`${leader.name} profile`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-6xl text-gray-400">
                {leader.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{leader.name}</h1>
            {leader.nickname && (
              <span className="text-xl text-gray-500">({leader.nickname})</span>
            )}
          </div>

          <p className="text-xl text-blue-600 font-medium mb-4">
            {leader.position}
          </p>

          {leader.summary && (
            <p className="text-gray-600 mb-4">{leader.summary}</p>
          )}

          {/* Social Links */}
          <div className="flex gap-4">
            {leader.socialLinks.github && (
              <a
                href={leader.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {leader.socialLinks.linkedin && (
              <a
                href={leader.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {leader.socialLinks.twitter && (
              <a
                href={leader.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {leader.socialLinks.website && (
              <a
                href={leader.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <Globe className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {leader.skills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {leader.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career Section */}
      {leader.career.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Career</h2>
          <div className="space-y-4">
            {leader.career.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.company}</p>
                  <p className="text-gray-600">{item.role}</p>
                </div>
                <p className="text-sm text-gray-500">{item.period}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Section */}
      {leader.message && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Message</h2>
          <blockquote className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 italic">&quot;{leader.message}&quot;</p>
          </blockquote>
        </div>
      )}
    </div>
  );
}
