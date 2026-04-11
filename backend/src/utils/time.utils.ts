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
