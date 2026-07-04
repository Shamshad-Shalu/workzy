import dayjs from "dayjs";

import { Day } from "@/types/worker/worker.entity";

export function getTodayKey(): Day {
  return dayjs().format("dddd").toLowerCase() as Day;
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
