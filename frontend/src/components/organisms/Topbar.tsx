import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-provider';
import workzyLogo from '@/assets/icons/logo-icon.jpg';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 border-b bg-background/80 backdrop-blur flex items-center justify-between px-4 lg:px-6">
      <button className="lg:hidden" onClick={onMenuClick}>
        <Menu size={26} />
      </button>
      <div className="lg:hidden flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        <img src={workzyLogo} className="h-8 w-8" />
        <span className="font-semibold text-lg">WorkZy</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  );
}
