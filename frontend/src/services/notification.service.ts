import { NOTIFICATION_API } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';
import type {
  Notification,
  NotificationListingResponse,
  NotificationListQuery,
} from '@/types/notification';

const NotificationService = {
  getNotifications: async (params: NotificationListQuery): Promise<NotificationListingResponse> => {
    const res = await api.get<ApiResponse<NotificationListingResponse>>(NOTIFICATION_API.ROOT, {
      params,
    });
    return res.data.data;
  },
  markAsRead: async (id: string): Promise<Notification> => {
    const res = await api.patch<ApiResponse<Notification>>(NOTIFICATION_API.MARK_AS_READ(id));
    return res.data.data;
  },
  markAllAsRead: async (type: 'WORKER' | 'USER'): Promise<{ modifiedCount: number }> => {
    const res = await api.patch<ApiResponse<{ modifiedCount: number }>>(
      NOTIFICATION_API.MARK_ALL_AS_READ,
      null,
      {
        params: { type },
      }
    );
    return res.data.data;
  },
};

export default NotificationService;
