import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { ReactNode } from 'react';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  match?: string;
  collapsed?: boolean;
}

export function SidebarItem({ icon, label, to, match, collapsed }: SidebarItemProps) {
  const location = useLocation();

  const isActive = location.pathname === to || (match && location.pathname.startsWith(match));

  const Item = (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer',
        'hover:bg-accent hover:text-accent-foreground',

        isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground',

        collapsed ? 'justify-center px-2' : 'justify-start'
      )}
    >
      <span className="text-[20px]">{icon}</span>

      {!collapsed && <span className="text-[15px]">{label}</span>}
    </NavLink>
  );

  if (!collapsed) {
    return Item;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{Item}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
