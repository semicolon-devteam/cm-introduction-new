/**
 * 달력 유틸리티 함수
 */

/**
 * 해당 월의 일수를 반환
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 해당 월의 첫 번째 날의 요일 (0: 일요일 ~ 6: 토요일)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * 달력 그리드 생성 (6주 x 7일)
 * 이전 달/다음 달 날짜도 포함
 */
export function generateCalendarGrid(year: number, month: number): (Date | null)[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const grid: (Date | null)[][] = [];

  let currentDate = 1;

  for (let week = 0; week < 6; week++) {
    const weekDays: (Date | null)[] = [];

    for (let day = 0; day < 7; day++) {
      if (week === 0 && day < firstDay) {
        // 이전 달 날짜 (null로 표시)
        weekDays.push(null);
      } else if (currentDate > daysInMonth) {
        // 다음 달 날짜 (null로 표시)
        weekDays.push(null);
      } else {
        weekDays.push(new Date(year, month, currentDate));
        currentDate++;
      }
    }

    grid.push(weekDays);

    // 모든 날짜를 채웠으면 종료
    if (currentDate > daysInMonth) {
      // 마지막 주가 완전히 비어있지 않으면 추가
      if (weekDays.some((d) => d !== null)) {
        // 이미 추가됨
      }
      // 다음 주가 필요한지 확인
      if (week < 5 && weekDays[6] !== null) {
        continue;
      }
      break;
    }
  }

  return grid;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 오늘 날짜인지 확인
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 월 이름 반환 (한국어)
 */
export function getMonthName(month: number): string {
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  return months[month];
}

/**
 * 요일 이름 배열 (한국어)
 */
export const WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 주의 시작일 계산 (월요일 기준)
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * 주의 종료일 계산 (일요일 기준)
 */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

/**
 * 월의 시작일
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 월의 종료일
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
