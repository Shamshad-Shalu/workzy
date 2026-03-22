import dayjs from 'dayjs';

export function formatTime12(time: string): string {
  return dayjs(`2000-01-01 ${time}`).format('h:mm A');
}

export function formatDuration(minutes: number): string {
  const d = dayjs.duration(minutes, 'minutes');

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

export function formatSmartDate(date: string | Date): string {
  const d = dayjs(date);
  const today = dayjs();

  if (d.isSame(today, 'day')) {
    return 'Today';
  }
  if (d.isSame(today.add(1, 'day'), 'day')) {
    return 'Tomorrow';
  }

  return d.format('dddd, DD MMM');
}
