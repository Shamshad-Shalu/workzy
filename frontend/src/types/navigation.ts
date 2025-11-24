import type { JSX } from 'react';

export interface MenuItem {
  icon: JSX.Element;
  label: string;
  to: string;
}
