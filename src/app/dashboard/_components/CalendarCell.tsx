"use client";

import { isToday } from "../_utils/calendar.utils";
import { CalendarEventItem } from "./CalendarEvent";
import type { CalendarEvent } from "./types";
import { EVENT_TYPE_COLORS } from "./types";

interface CalendarCellProps {
  date: Date | null;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarCell({
  date,
  events,
  isCurrentMonth,
  onDateClick,
  onEventClick,
}: CalendarCellProps) {
  if (!date) {
    return <div className="min-h-[100px] bg-[#0d0e12]/50 border border-[#25262b]" />;
  }

  const today = isToday(date);
  const maxVisibleEvents = 2;
  const visibleEvents = events.slice(0, maxVisibleEvents);
  const remainingCount = events.length - maxVisibleEvents;

  return (
    <div
      className={`min-h-[100px] p-1.5 border border-[#25262b] transition-colors ${
        isCurrentMonth ? "bg-[#1a1b23]" : "bg-[#0d0e12]/50"
      } ${today ? "border-brand-primary/50" : ""} hover:bg-[#25262b]/50 cursor-pointer`}
      onClick={() => onDateClick?.(date)}
    >
      {/* 날짜 */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={`w-6 h-6 flex items-center justify-center text-xs rounded-full ${
            today
              ? "bg-brand-primary text-white font-bold"
              : isCurrentMonth
                ? "text-white"
                : "text-[#5c5f66]"
          }`}
        >
          {date.getDate()}
        </span>
        {/* 이벤트 도트 인디케이터 */}
        {events.length > 0 && (
          <div className="flex gap-0.5">
            {events.slice(0, 3).map((event, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPE_COLORS[event.type].bg}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 이벤트 목록 */}
      <div className="space-y-0.5">
        {visibleEvents.map((event) => (
          <CalendarEventItem
            key={event.id}
            event={event}
            compact
            onClick={() => {
              onEventClick?.(event);
            }}
          />
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-[#5c5f66] px-1.5 py-0.5">+{remainingCount}개 더보기</div>
        )}
      </div>
    </div>
  );
}
