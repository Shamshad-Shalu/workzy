import {
  Bell,
  Briefcase,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  User2,
  Wallet,
} from 'lucide-react';

import type { MenuItem } from '@/types/navigation';

export const workerMenuItems: MenuItem[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard', to: '/worker/dashboard' },
  { icon: <Briefcase />, label: 'My Bookings', to: '/worker/bookings' },
  { icon: <ClipboardList />, label: 'My Services', to: '/worker/services' },
  { icon: <User2 />, label: 'Profile', to: '/worker/Profile' },
  { icon: <Wallet />, label: 'Wallet', to: '/worker/wallet' },
  { icon: <FileText />, label: 'Subscription', to: '/worker/subscriptions' },
  { icon: <Star />, label: 'Reviews', to: '/worker/reviews' },
  { icon: <MessageSquare />, label: 'Chats', to: '/worker/chats' },
  { icon: <Bell />, label: 'Notifications', to: '/worker/notifications' },
];

export const workerSupportItems: MenuItem[] = [
  { icon: <HelpCircle />, label: 'Support', to: '/worker/support' },
  { icon: <Settings />, label: 'Settings', to: '/worker/settings' },
];
