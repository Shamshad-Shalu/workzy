import dayjs from "dayjs";

export const minutesToTime = (minutes: number): string =>
  dayjs().startOf("day").add(minutes, "minute").format("HH:mm");

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};
