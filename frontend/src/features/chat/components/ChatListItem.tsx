import { Ban } from 'lucide-react';
import { Receipt } from 'lucide-react';

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

  const otherUserId = role === ROLE.USER ? participants.worker.id : participants.user.id;

  const isOnline = onlineUsers.has(otherUserId);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent',
        active && 'bg-accent',
        !chat.isActive && 'opacity-70'
      )}
    >
      <div className="relative flex-shrink-0">
        {profilePart ? (
          <ProfileImage src={profilePart.profileImage} name={profilePart.name} size={42} />
        ) : (
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
            {chatId.slice(-4)}
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-medium text-foreground">
              {isAdmin ? chatId : profilePart?.name}
            </span>
            {!chat.isActive && (
              <span className="shrink-0 rounded-full bg-destructive/10 px-1.5 py-px text-[10px] font-medium text-destructive">
                Closed
              </span>
            )}
          </div>
          {lastMessage?.createdAt && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatChatDate(lastMessage.createdAt, 'smart')}
            </span>
          )}
        </div>

        <div className="mb-1 flex items-center gap-1">
          <Receipt className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="truncate text-[11px] text-muted-foreground/70">{chat.chatId}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            {isAdmin ? (
              <span className="truncate">
                {participants.user.name} ↔ {participants.worker.name}
              </span>
            ) : lastMessage ? (
              lastMessage.isDeleted ? (
                <span className="flex items-center gap-1 italic opacity-60">
                  <Ban className="h-3 w-3 shrink-0" />
                  {lastMessage.role === role
                    ? 'You deleted this message'
                    : 'This message was deleted'}
                </span>
              ) : (
                <>
                  <span className="shrink-0 font-medium text-foreground/70">
                    {lastMessage.role === role ? 'You:' : `${lastMessage.role}:`}
                  </span>
                  <span className="truncate">
                    {lastMessage.type === MESSAGE_TYPE.VIDEO
                      ? '🎥 Video'
                      : lastMessage.type === MESSAGE_TYPE.IMAGE
                        ? '📷 Photo'
                        : lastMessage.type === MESSAGE_TYPE.AUDIO
                          ? '🎵 Audio'
                          : lastMessage.content}
                  </span>
                </>
              )
            ) : (
              <span className="italic opacity-50">No messages yet</span>
            )}
          </div>

          {!active && role !== ROLE.ADMIN && unread > 0 && (
            <span className="ml-1 inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
