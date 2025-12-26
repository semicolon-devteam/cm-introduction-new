/**
 * PartTimerList Component
 *
 * 파트타이머 목록을 표시하는 컴포넌트
 * 단순 텍스트 리스트 형태 (이미지 없음)
 */

import type { PartTimer } from "../_repositories";

interface PartTimerListProps {
  partTimers: PartTimer[];
}

export function PartTimerList({ partTimers }: PartTimerListProps) {
  if (partTimers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        등록된 파트타이머가 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {partTimers.map((partTimer) => (
        <li
          key={partTimer.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
        >
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {partTimer.nickname}
            </span>
            <span className="text-sm text-gray-500">{partTimer.role}</span>
          </div>
          {partTimer.team && (
            <span className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
              {partTimer.team}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
