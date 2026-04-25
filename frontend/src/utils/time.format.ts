import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

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
  const tomorrow = today.add(1, 'day');
  const yesterday = today.subtract(1, 'day');

  if (d.isSame(today, 'day')) {
    return 'Today';
  }
  if (d.isSame(tomorrow, 'day')) {
    return 'Tomorrow';
  }
  if (d.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }
  return d.format('dddd, DD MMM');
}

export function formatSmartDateTime(date: string | Date): string {
  const d = dayjs(date);
  const time = d.format('h:mm A');
  const today = dayjs();
  const yesterday = today.subtract(1, 'day');
  const tomorrow = today.add(1, 'day');

  if (d.isSame(today, 'day')) {
    return `Today · ${time}`;
  }
  if (d.isSame(yesterday, 'day')) {
    return `Yesterday · ${time}`;
  }
  if (d.isSame(tomorrow, 'day')) {
    return `Tomorrow · ${time}`;
  }

  return `${d.format('dddd, DD MMM')} · ${time}`;
}

export function calculateEndTime(startTime: string, durationMins: number): string {
  return dayjs(startTime, 'HH:mm').add(durationMins, 'minutes').format('h:mm A');
}
export function formatDateRangeDuration(start: string | Date, end: string | Date): string {
  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day');
  const days = endDate.diff(startDate, 'day') + 1;

  return days === 1 ? '1 day' : `${days} days`;
}

export function formatReviewDate(date: string | Date) {
  const now = dayjs();
  const reviewDate = dayjs(date);

  if (now.diff(reviewDate, 'day') < 7) {
    return reviewDate.fromNow();
  }
  return reviewDate.format('DD MMM YYYY');
}

export function formatDateForUrl(date: Date | null | undefined): string | undefined {
  if (!date) {
    return undefined;
  }
  return dayjs(date).format('YYYY-MM-DD');
}
