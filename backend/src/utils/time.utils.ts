import dayjs from "dayjs";

export function getTodayKey() {
  return dayjs().format("dddd").toLowerCase();
}

export function getCurrentTime() {
  return dayjs().format("HH:mm");
}
