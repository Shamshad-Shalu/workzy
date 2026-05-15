export interface Notification {
  id: string;
  type: string;
  recipientId: string;
  heading: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationListingResponse {
  notifications: Notification[];
  nextCursor: string | null;
}

export interface NotificationListQuery {
  limit: number;
  cursor?: string | null;
  read?: string;
  type?: 'WORKER' | 'USER';
}
