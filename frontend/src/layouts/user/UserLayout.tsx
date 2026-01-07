import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background w-full">
      <Header />
      <main className="flex-1 pt-16 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
