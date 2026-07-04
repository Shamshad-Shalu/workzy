import { ROLE } from '@/constants';
import ChatPage from '@/features/chat/pages/ChatPage';

export default function WorkerChatPage() {
  return <ChatPage role={ROLE.WORKER} />;
}
