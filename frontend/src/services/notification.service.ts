import { NOTIFICATION_API } from '@/constants';
import api from '@/lib/api/axios';
import type {
  Notification,
  NotificationListingResponse,
  NotificationListQuery,
} from '@/types/notification';

const NotificationService = {
  getNotifications: async (params: NotificationListQuery): Promise<NotificationListingResponse> => {
    const res = await api.get(NOTIFICATION_API.ROOT, { params });
    return res.data;
  },
  markAsRead: async (id: string): Promise<Notification> => {
    const res = await api.patch(NOTIFICATION_API.MARK_AS_READ(id));
    return res.data.notification as Notification;
  },
  markAllAsRead: async (type: 'WORKER' | 'USER'): Promise<{ modifiedCount: number }> => {
    const res = await api.patch(NOTIFICATION_API.MARK_ALL_AS_READ, null, {
      params: { type },
    });
    return res.data;
  },
};

export default NotificationService;
