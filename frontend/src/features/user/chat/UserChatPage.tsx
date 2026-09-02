import { ROLE } from '@/constants';
import ChatPage from '@/features/chat/pages/ChatPage';

export default function UserChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto p-2 sm:p-4 overflow-hidden">
      <div className="h-full w-full rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
        <ChatPage role={ROLE.USER} />
      </div>
    </div>
  );
}
