import dayjs from "dayjs";

export function getTodayKey() {
  return dayjs().format("dddd").toLowerCase();
}

export function getCurrentTime() {
  return dayjs().format("HH:mm");
}
export function getTodayStart(): Date {
  return dayjs().startOf("day").toDate();
}

export function getTodayEnd(): Date {
  return dayjs().endOf("day").toDate();
}

export function getMonthRange(date?: Date) {
  const base = date ? dayjs(date) : dayjs();
  return {
    start: base.startOf("month").toDate(),
    end: base.endOf("month").toDate(),
  };
}

export function formatTime12(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format("h:mm A");
}

export const formatTimeRange = (start: string, end: string) =>
  `${formatTime12(start)} → ${formatTime12(end)}`;
