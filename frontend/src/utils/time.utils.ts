import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function formatTime12(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format('h:mm A');
}

export function formatDuration(minutes: number): string {
  const d = dayjs.duration(minutes, 'minutes');

  const hours = d.hours();
  const mins = d.minutes();

  if (hours === 0) {return `${mins}m`;}
  if (mins === 0) {return `${hours}h`;}

  return `${hours}h ${mins}m`;
}
