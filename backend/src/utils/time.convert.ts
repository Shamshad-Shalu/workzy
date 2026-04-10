import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const minutesToTime = (minutes: number): string =>
  dayjs().startOf("day").add(minutes, "minute").format("HH:mm");

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export function formatDuration(minutes: number): string {
  const d = dayjs.duration(minutes, "minutes");

  const hours = d.hours();
  const mins = d.minutes();

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}
