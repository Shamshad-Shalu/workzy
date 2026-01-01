import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useSidebarState(mobile: boolean = false) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [userCollapsed, setUserCollapsed] = useState<boolean>(false);
  const [initialRender, setInitialRender] = useState<boolean>(true);

  const isMessenger =
    location.pathname.includes('/chats') || location.pathname.includes('/messages');

  useEffect(() => setInitialRender(false), []);

  useLayoutEffect(() => {
    const saved = localStorage.getItem('sidebar_preferance');
    if (saved !== null) {
      setUserCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    setUserCollapsed(next);
    localStorage.setItem('sidebar_preferance', String(next));
  };

  useLayoutEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      if (mobile) {
        return setCollapsed(false);
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

  return { collapsed, toggleCollapse, initialRender };
}
