export interface NotificationConfig {
  icon: string;
  color: string;
}

export const NOTIFICATION_CONFIG: Record<string, NotificationConfig> = {
  booking_accepted: { icon: 'CalendarCheck', color: '#10b981' },
  booking_rejected: { icon: 'CalendarX', color: '#ef4444' },
  job_completed: { icon: 'CheckCircle', color: '#3b82f6' },

  new_booking_request: { icon: 'CalendarPlus', color: '#f59e0b' },
  job_approved: { icon: 'ThumbsUp', color: '#3b82f6' },

  account_blocked: { icon: 'Ban', color: '#ef4444' },
  account_unblocked: { icon: 'Unlock', color: '#10b981' },

  worker_verified: { icon: 'ShieldCheck', color: '#10b981' },
  worker_revision: { icon: 'FileWarning', color: '#f59e0b' },
  worker_rejected: { icon: 'ShieldAlert', color: '#ef4444' },
};

export function getNotificationConfig(type: string): NotificationConfig {
  return NOTIFICATION_CONFIG[type] ?? { icon: 'Bell', color: '#6366f1' };
}
