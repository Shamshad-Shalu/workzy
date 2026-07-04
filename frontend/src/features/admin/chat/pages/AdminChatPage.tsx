import { ROLE } from '@/constants';
import ChatPage from '@/features/chat/pages/ChatPage';

export default function AdminChatPage() {
  return <ChatPage role={ROLE.ADMIN} />;
}
