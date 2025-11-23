import React from 'react';

export default function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-foreground mb-2">{children}</label>;
}
