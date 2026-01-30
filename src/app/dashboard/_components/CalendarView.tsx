"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, ExternalLink, Tag, User, Calendar } from "lucide-react";
import {
  generateCalendarGrid,
  getMonthName,
  formatDateToString,
  WEEKDAY_NAMES,
} from "../_utils/calendar.utils";
import { CalendarCell } from "./CalendarCell";
import type { CalendarEvent } from "./types";
import { EVENT_TYPE_COLORS } from "./types";

interface CalendarViewProps {
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onMonthChange?: (year: number, month: number) => void;
}

export function CalendarView({
  events,
  onDateClick,
  onEventClick,
  onMonthChange,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 달력 그리드 생성
  const calendarGrid = useMemo(
    () => generateCalendarGrid(year, month),
    [year, month]
  );

  // 날짜별 이벤트 매핑
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateKey = event.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  // 이전/다음 월 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onMonthChange?.(today.getFullYear(), today.getMonth());
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    const dateKey = formatDateToString(date);
    const dayEvents = eventsByDate.get(dateKey) || [];
    setSelectedDate(date);
    setSelectedEvents(dayEvents);
    onDateClick?.(date);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedDate(null);
    setSelectedEvents([]);
  };

  // 이벤트 클릭 핸들러 (GitHub 이슈 링크 열기)
  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === "github_issue" && event.metadata && "html_url" in event.metadata) {
      window.open(event.metadata.html_url as string, "_blank");
    }
    onEventClick?.(event);
  };

  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            {year}년 {getMonthName(month)}
          </h2>
          <button
            onClick={goToToday}
            className="px-2 py-1 text-xs text-brand-primary border border-brand-primary/30 rounded hover:bg-brand-primary/10 transition-colors"
          >
            오늘
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#25262b] transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5 text-[#909296]" />
          </button>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#25262b] transition-colors"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5 text-[#909296]" />
          </button>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#25262b] bg-[#25262b]/30">
        {(Object.keys(EVENT_TYPE_COLORS) as Array<keyof typeof EVENT_TYPE_COLORS>).map(
          (type) => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-[#909296]">
              <div className={`w-2 h-2 rounded-full ${EVENT_TYPE_COLORS[type].bg}`} />
              <span>{EVENT_TYPE_COLORS[type].label}</span>
            </div>
          )
        )}
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-[#25262b]">
        {WEEKDAY_NAMES.map((day, index) => (
          <div
            key={day}
            className={`py-2 text-center text-xs font-medium ${
              index === 0
                ? "text-red-400"
                : index === 6
                  ? "text-blue-400"
                  : "text-[#909296]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7">
        {calendarGrid.map((week, weekIndex) =>
          week.map((date, dayIndex) => {
            const dateKey = date ? formatDateToString(date) : "";
            const dayEvents = eventsByDate.get(dateKey) || [];
            const isCurrentMonth = date ? date.getMonth() === month : false;

            return (
              <CalendarCell
                key={`${weekIndex}-${dayIndex}`}
                date={date}
                events={dayEvents}
                isCurrentMonth={isCurrentMonth}
                onDateClick={handleDateClick}
                onEventClick={onEventClick}
              />
            );
          })
        )}
      </div>

      {/* 날짜 상세 모달 */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a1b23] rounded-lg border border-[#373A40] w-full max-w-lg max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-primary" />
                <h3 className="text-lg font-semibold text-white">
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#25262b] transition-colors"
              >
                <X className="w-5 h-5 text-[#909296]" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {selectedEvents.length === 0 ? (
                <div className="text-center py-8 text-[#909296]">
                  <p>이 날짜에 등록된 이벤트가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-[#25262b] rounded-lg border border-[#373A40] hover:border-[#5c5f66] transition-colors cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      {/* 이벤트 타입 & 상태 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${EVENT_TYPE_COLORS[event.type].bg} ${EVENT_TYPE_COLORS[event.type].text}`}>
                          {EVENT_TYPE_COLORS[event.type].label}
                        </span>
                        {event.status && (
                          <span className="px-2 py-0.5 text-xs rounded bg-[#373A40] text-[#909296]">
                            {event.status}
                          </span>
                        )}
                      </div>

                      {/* 제목 */}
                      <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        {event.title}
                        {event.type === "github_issue" && (
                          <ExternalLink className="w-3.5 h-3.5 text-[#5c5f66]" />
                        )}
                      </h4>

                      {/* GitHub 이슈 상세 정보 */}
                      {event.type === "github_issue" && event.metadata && "repository" in event.metadata && (
                        <div className="space-y-1.5 text-xs text-[#909296]">
                          {/* 레포지토리 */}
                          {event.metadata.repository && (
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-3 h-3" />
                              <span>{event.metadata.repository as string}</span>
                              {"number" in event.metadata && event.metadata.number && (
                                <span className="text-[#5c5f66]">#{event.metadata.number as number}</span>
                              )}
                            </div>
                          )}

                          {/* 담당자 */}
                          {"assignees" in event.metadata && Array.isArray(event.metadata.assignees) && event.metadata.assignees.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              <span>{(event.metadata.assignees as string[]).map((a) => `@${a}`).join(", ")}</span>
                            </div>
                          )}

                          {/* 라벨 */}
                          {"labels" in event.metadata && Array.isArray(event.metadata.labels) && event.metadata.labels.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-2">
                              {(event.metadata.labels as Array<{name: string; color: string}>).slice(0, 5).map((label, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 rounded text-[10px]"
                                  style={{
                                    backgroundColor: `#${label.color}20`,
                                    color: `#${label.color}`,
                                    border: `1px solid #${label.color}40`,
                                  }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 마일스톤/목표 상세 정보 */}
                      {(event.type === "milestone" || event.type === "goal") && event.metadata && (
                        <div className="text-xs text-[#909296]">
                          {"description" in event.metadata && event.metadata.description && (
                            <p className="line-clamp-2">{event.metadata.description as string}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="p-4 border-t border-[#373A40] flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-white bg-[#25262b] border border-[#373A40] rounded hover:bg-[#373A40] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarViewSkeleton() {
  return (
    <div className="bg-[#1a1b23] rounded-lg border border-[#373A40] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#373A40]">
        <div className="h-6 w-32 bg-[#25262b] animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-[#25262b] animate-pulse rounded" />
          <div className="w-8 h-8 bg-[#25262b] animate-pulse rounded" />
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-[#25262b]">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="py-2 flex justify-center">
            <div className="h-4 w-4 bg-[#25262b] animate-pulse rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="min-h-[100px] p-2 border border-[#25262b] bg-[#1a1b23]"
          >
            <div className="h-4 w-4 bg-[#25262b] animate-pulse rounded mb-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { CalendarViewSkeleton };
