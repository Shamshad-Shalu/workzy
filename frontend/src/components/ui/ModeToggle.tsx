import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/context/theme/use-theme';

import Button from '../atoms/Button';

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
