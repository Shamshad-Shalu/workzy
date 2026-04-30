import { useState } from 'react';

export function useModalState<T = string>() {
  const [data, setData] = useState<T | null>(null);
  return {
    data,
    open: (value: T) => setData(value),
    close: () => setData(null),
    isOpen: data !== null,
  };
}
