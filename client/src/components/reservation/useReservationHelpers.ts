/**
 * 예약 폼 공통 헬퍼 훅
 * - formatPhoneNumber: 한국 번호 자동 포맷
 * - isAvailableDate: 예약 가능 날짜 검사
 * - getAvailableTimes: 선택 날짜의 예약 가능 시간 목록
 */
import { trpc } from "@/lib/trpc";
import { CLINIC_HOURS, HOLIDAYS } from "./constants";

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length > 11) return numbers.slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}

export function useReservationHelpers() {
  const { data: unavailableSlotsData } = trpc.schedule.unavailableDates.useQuery();

  const isAvailableDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const today = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), koreaTime.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date < tomorrow) return false;
    if (HOLIDAYS.includes(dateStr)) return false;
    if (date.getDay() === 0) return false;
    if (unavailableSlotsData?.some((slot) => slot.date === dateStr)) return false;
    return true;
  };

  const getAvailableTimes = (dateStr: string): string[] => {
    if (!dateStr) return [];
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const hours = CLINIC_HOURS[String(dayOfWeek)];
    if (!hours || hours.start === null || hours.end === null) return [];
    const startH = Math.ceil(hours.start);
    const endH = hours.end - 1;
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const times: string[] = [];
    for (let h = startH; h <= endH; h++) {
      if (isWeekday && h >= 13 && h < 14) continue; // 점심시간 제외
      times.push(`${String(h).padStart(2, "0")}:00`);
    }
    return times;
  };

  /** 내일 날짜 (yyyy-MM-dd) — input[type=date] min 속성용 */
  const tomorrowStr = (): string => {
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const tomorrow = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), koreaTime.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return { isAvailableDate, getAvailableTimes, tomorrowStr };
}
