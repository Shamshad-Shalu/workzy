import { Outlet, useLocation } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

export default function UserLayout() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/messages');

  return (
    <div className="flex min-h-screen flex-col bg-background w-full">
      <Header />
      <main className="flex-1 pt-16 overflow-x-hidden">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}
