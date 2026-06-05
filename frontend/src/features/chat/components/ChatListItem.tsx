import { Ban } from 'lucide-react';

import ProfileImage from '@/components/molecules/ProfileImage';
import { MESSAGE_TYPE, ROLE, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import { cn } from '@/lib/utils';
import type { ChatRoom } from '@/types/chat';
import { formatChatDate } from '@/utils/time.format';

interface ChatListItemProps {
  chat: ChatRoom;
  role: Role;
  active: boolean;
  onClick: () => void;
}

export default function ChatListItem({ chat, role, active, onClick }: ChatListItemProps) {
  const { onlineUsers } = useSocket();
  const { participants, chatId, lastMessage, unread = 0 } = chat;
  const isAdmin = role === ROLE.ADMIN;
  const profilePart =
    role === ROLE.WORKER ? participants.user : role === ROLE.USER ? participants.worker : null;

  const otherUserId = role === ROLE.USER ? chat.participants.worker.id : chat.participants.user.id;

  const isOnline = onlineUsers.has(otherUserId);
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent',
        {
          'bg-accent': active,
        }
      )}
    >
      {profilePart ? (
        <div className="relative">
          <ProfileImage src={profilePart.profileImage} name={profilePart.name} size={40} />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          )}
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
          {chatId.slice(-4)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{isAdmin ? chatId : profilePart?.name}</p>
          {lastMessage?.createdAt && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatChatDate(lastMessage?.createdAt, 'smart')}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-sm text-muted-foreground flex items-center gap-1">
            {isAdmin ? (
              <span>
                {participants.user.name} ↔ {participants.worker.name}
              </span>
            ) : lastMessage ? (
              lastMessage.isDeleted ? (
                <span className="flex items-center italic text-xs opacity-70 gap-1">
                  <Ban className="size-3" />
                  {lastMessage.role === role
                    ? 'You deleted this message'
                    : 'This message was deleted'}
                </span>
              ) : (
                <>
                  <span className="font-medium text-foreground/80">
                    {lastMessage.role === role ? 'You:' : `${lastMessage.role}:`}
                  </span>

                  {lastMessage.type === MESSAGE_TYPE.VIDEO ? (
                    '🎥 Video'
                  ) : lastMessage.type === MESSAGE_TYPE.IMAGE ? (
                    '📷 Photo'
                  ) : lastMessage.type === MESSAGE_TYPE.AUDIO ? (
                    '🎵 Audio'
                  ) : (
                    <span className="truncate">{lastMessage.content?.substring(0, 20)}</span>
                  )}
                </>
              )
            ) : (
              'No messages yet'
            )}
          </div>

          {!active && role !== ROLE.ADMIN && unread > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
