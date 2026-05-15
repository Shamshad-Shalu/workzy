import type { RequestHandler } from "express";

export interface INotificationController {
  getNotifications: RequestHandler;
  markAsRead: RequestHandler;
  markAllAsRead: RequestHandler;
}
