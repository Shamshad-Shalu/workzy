import { ROLE } from '@/constants';
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Repeat } from 'lucide-react';
import workzyLogo from '../../assets/icons/logo-icon.jpg';
import workzyIcon from '../../assets/icons/logo-icon.jpg';
import { cn } from '@/lib/utils';
import { SidebarItem } from '../molecules/SidebarItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import type { User } from '@/types/user';
import type { MenuItem } from '@/types/navigation';
import { clearUser } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';

interface BaseSidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
  initialRender: boolean;
  mobile?: boolean;

  menuItems: MenuItem[];
  supportItems?: MenuItem[];
  user: User;
}

export function BaseSidebar({
  collapsed,
  toggleCollapse,
  initialRender,
  mobile = false,
  menuItems,
  supportItems = [],
  user,
}: BaseSidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  const handleSwitchMode = () => {
    navigate('/?as=user');
  };

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-card border-r shadow-sm overflow-hidden no-scrollbar',
        !initialRender && 'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-72',
        mobile && 'w-72'
      )}
    >
      <div
        className={cn('flex items-center p-4', collapsed ? 'justify-center' : 'justify-between')}
      >
        <div className="flex items-center gap-3">
          <img src={collapsed ? workzyIcon : workzyLogo} className="h-10" />
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

      {/* menu items  */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar">
        {menuItems.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            label={item.label}
            to={item.to}
            collapsed={collapsed}
          />
        ))}

        {supportItems.length > 0 && (
          <>
            <Separator className="my-4" />
            {supportItems.map((item, i) => (
              <SidebarItem
                key={i}
                icon={item.icon}
                label={item.label}
                to={item.to}
                collapsed={collapsed}
              />
            ))}
          </>
        )}
      </div>
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
                <img src={user.profileImage} className="w-full h-full object-cover" />
              </div>

              {!collapsed && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              )}

              {!collapsed && <ChevronDown size={14} />}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 rounded-xl p-2" align="end">
            {user.role === ROLE.WORKER && (
              <DropdownMenuItem className="p-3 text-sm" onClick={handleSwitchMode}>
                <Repeat className="mr-2 h-4 w-4" /> Switch to User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="p-3 text-red-500 text-sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
