import { MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchInput from '@/components/molecules/SearchInput';
import { ROLE, type Role } from '@/constants';

import { useChats } from '../hooks/useChats';

import ChatListItem from './ChatListItem';

interface ChatSidebarProps {
  activeChatId?: string;
  role?: Role;
}

export default function ChatSidebar({ activeChatId, role = ROLE.ADMIN }: ChatSidebarProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isActive, _setIsActive] = useState<string | undefined>(undefined);

  const { chats } = useChats({ search, isActive });

  const getChatPath = (id: string) =>
    role === ROLE.USER ? `/messages/${id}` : `/${role}/messages/${id}`;

  return (
    <aside className="hidden w-80 flex-col border-r border-border bg-card md:flex h-full">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div>
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="text-xs text-muted-foreground">Your conversations</p>
        </div>
        <button className="rounded-full p-2 hover:bg-accent">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <SearchInput
            value={search}
            debounce={800}
            onChange={value => setSearch(value)}
            className="w-full rounded-full border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search by chat / booking ID"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            role={role}
            active={activeChatId === chat.id}
            onClick={() => navigate(getChatPath(chat.id))}
          />
        ))}
      </div>
    </aside>
  );
}
