import { ROLE } from '@/constants';
import ChatPage from '@/features/chat/pages/ChatPage';
import Header from '@/layouts/user/Header';

export default function UserChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChatPage role={ROLE.USER} />
        </div>
      </main>
    </div>
  );
}
