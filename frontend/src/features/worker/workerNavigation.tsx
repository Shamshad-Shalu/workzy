import type { MenuItem } from '@/types/navigation';
import {
  Bell,
  Briefcase,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  User2,
  Wallet,
} from 'lucide-react';

export const workerMenuItems: MenuItem[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard', to: '/worker/dashboard' },
  { icon: <Briefcase />, label: 'My Jobs', to: '/worker/jobs' },
  { icon: <ClipboardList />, label: 'Listings', to: '/worker/listings' },
  { icon: <User2 />, label: 'Profile', to: '/worker/Profile' },
  { icon: <Wallet />, label: 'Wallet', to: '/worker/wallet' },
  { icon: <Star />, label: 'Reviews', to: '/worker/reviews' },
  { icon: <MessageSquare />, label: 'Chats', to: '/worker/chats' },
  { icon: <Bell />, label: 'Notifications', to: '/worker/notifications' },
];

export const workerSupportItems: MenuItem[] = [
  { icon: <HelpCircle />, label: 'Support', to: '/worker/support' },
  { icon: <Settings />, label: 'Settings', to: '/worker/settings' },
];
