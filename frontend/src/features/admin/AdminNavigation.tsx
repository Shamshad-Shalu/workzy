import {
  LayoutDashboard,
  Users,
  UserCircle,
  Briefcase,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
} from 'lucide-react';
import type { MenuItem } from '@/types/navigation';

export const adminMenuItems: MenuItem[] = [
  { icon: <LayoutDashboard />, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: <Users />, label: 'Users', to: '/admin/users' },
  { icon: <UserCircle />, label: 'Workers', to: '/admin/workers' },
  { icon: <Briefcase />, label: 'Services', to: '/admin/services' },
  { icon: <Briefcase />, label: 'Jobs', to: '/admin/jobs' },
  { icon: <MessageSquare />, label: 'Messages', to: '/admin/messages' },
  { icon: <FileText />, label: 'Subscription', to: '/admin/subscriptions' },
  { icon: <CreditCard />, label: 'Transactions', to: '/admin/transactions' },
];

export const adminSupportItems: MenuItem[] = [
  { icon: <Settings />, label: 'Settings', to: '/admin/settings' },
];
