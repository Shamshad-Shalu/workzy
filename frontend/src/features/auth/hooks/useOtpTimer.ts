import { useCallback, useEffect, useState } from 'react';

export function useOtpTimer(initialTime: number = 30) {
  const [timer, setTimer] = useState<number>(initialTime);

  useEffect(() => {
    if (timer === 0) {
      return;
    }
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);

    return () => clearInterval(id);
  }, [timer]);

  const resetTimer = useCallback(() => {
    setTimer(initialTime);
  }, [initialTime]);

  return { timer, resetTimer };
}
