import { useState, useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Wallet,
  Star,
  MessageSquare,
  Bell,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Repeat,
} from 'lucide-react';

import { SidebarItem } from '@/components/molecules/SidebarItem';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import FullLogo from '@/assets/icons/logo-icon.jpg';
import LogoIcon from '@/assets/icons/logo-icon.jpg';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WorkerSidebarProps {
  mobile?: boolean;
}

export function WorkerSidebar({ mobile = false }: WorkerSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);

  const isMessenger =
    location.pathname.startsWith('/worker/chats') ||
    location.pathname.startsWith('/worker/messages');

  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    setInitialRender(false);
  }, []);

  useLayoutEffect(() => {
    const saved = localStorage.getItem('worker_sidebar_pref');
    if (saved !== null) {
      setUserCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    setUserCollapsed(next);
    localStorage.setItem('worker_sidebar_pref', String(next));
  };

  useLayoutEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (mobile) {
        setCollapsed(false);
        return;
      }

      if (isMessenger) {
        return setCollapsed(true);
      }

      if (width < 1024) {
        return setCollapsed(true);
      }

      if (width >= 1024 && width < 1280) {
        return setCollapsed(true);
      }

      return setCollapsed(userCollapsed);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [mobile, userCollapsed, isMessenger]);

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-background border-r shadow-sm overflow-hidden',
        !initialRender && 'transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-72',
        mobile && 'w-72'
      )}
    >
      {/* TOP */}
      <div
        className={cn('flex items-center p-4', collapsed ? 'justify-center' : 'justify-between')}
      >
        <div className="flex items-center gap-3">
          <img src={collapsed ? LogoIcon : FullLogo} className="h-10" />
          {!collapsed && <span className="text-lg font-semibold">WorkZy</span>}
        </div>

        {!collapsed && !mobile && (
          <button onClick={toggleCollapse}>
            <ChevronLeft size={20} />
          </button>
        )}

        {collapsed && !mobile && (
          <button className="absolute left-[62px]" onClick={toggleCollapse}>
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 sidebar-scroll">
        <SidebarItem
          icon={<LayoutDashboard />}
          label="Dashboard"
          to="/worker/dashboard"
          collapsed={collapsed}
        />
        <SidebarItem icon={<Briefcase />} label="My Jobs" to="/worker/jobs" collapsed={collapsed} />
        <SidebarItem
          icon={<ClipboardList />}
          label="Listings"
          to="/worker/listings"
          collapsed={collapsed}
        />
        <SidebarItem icon={<Wallet />} label="Wallet" to="/worker/wallet" collapsed={collapsed} />
        <SidebarItem icon={<Star />} label="Reviews" to="/worker/reviews" collapsed={collapsed} />
        <SidebarItem
          icon={<MessageSquare />}
          label="Chats"
          to="/worker/chats"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Bell />}
          label="Notifications"
          to="/worker/notifications"
          collapsed={collapsed}
        />
        <SidebarItem icon={<Star />} label="Reviews" to="/worker/reviews" collapsed={collapsed} />
        <SidebarItem
          icon={<MessageSquare />}
          label="Chats"
          to="/worker/chats"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Bell />}
          label="Notifications"
          to="/worker/notifications"
          collapsed={collapsed}
        />
        <SidebarItem icon={<Star />} label="Reviews" to="/worker/reviews" collapsed={collapsed} />
        <SidebarItem
          icon={<MessageSquare />}
          label="Chats"
          to="/worker/chats"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Bell />}
          label="Notifications"
          to="/worker/notifications"
          collapsed={collapsed}
        />

        <Separator className="my-4" />

        <SidebarItem
          icon={<HelpCircle />}
          label="Support"
          to="/worker/support"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          to="/worker/settings"
          collapsed={collapsed}
        />
      </div>

      {/* PROFILE */}
      <div className="p-4">
        <Separator className="mb-3" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'flex items-center p-3 rounded-xl cursor-pointer hover:bg-accent',
                collapsed && 'justify-center'
              )}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img src="/your-profile.jpg" className="w-full h-full object-cover" />
              </div>

              {!collapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@gmail.com</p>
                </div>
              )}

              {!collapsed && <ChevronDown size={14} />}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
            <DropdownMenuItem className="p-3 text-sm">
              <Repeat className="mr-2 h-4 w-4" /> Switch to User
            </DropdownMenuItem>

            <DropdownMenuItem className="p-3 text-red-500 text-sm">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
