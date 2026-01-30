"use client";

import type { CalendarEvent as CalendarEventType } from "./types";
import { EVENT_TYPE_COLORS } from "./types";

interface CalendarEventProps {
  event: CalendarEventType;
  compact?: boolean;
  onClick?: () => void;
}

export function CalendarEventItem({ event, compact = false, onClick }: CalendarEventProps) {
  const colors = EVENT_TYPE_COLORS[event.type];

  if (compact) {
    // 달력 셀 내 간단한 표시
    return (
      <button
        onClick={onClick}
        className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate ${colors.bgLight} ${colors.text} hover:opacity-80 transition-opacity`}
        title={event.title}
      >
        <span className="mr-1">{colors.icon}</span>
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  // 전체 표시 (리스트 등)
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg ${colors.bgLight} border ${colors.border} hover:bg-opacity-30 transition-all duration-150`}
    >
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{colors.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colors.text} truncate`}>
            {event.title}
          </p>
          <p className="text-xs text-[#909296] mt-0.5">
            {event.date} · {colors.label}
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded ${colors.bgLight} ${colors.text}`}
        >
          {event.status}
        </span>
      </div>
    </button>
  );
}
