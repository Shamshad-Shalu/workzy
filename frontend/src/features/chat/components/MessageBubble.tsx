import { Ban, Check, CheckCheck, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useState } from 'react';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Skeleton } from '@/components/ui/skeleton';
import { MESSAGE_TYPE, ROLE, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import { cn } from '@/lib/utils';
import type { ChatRoom } from '@/types/chat';
import type { ChatMessage } from '@/types/chatMessage';
import { formatChatDate } from '@/utils/time.format';

interface Props {
  message: ChatMessage;
  currentRole: Role;
  chat: ChatRoom;
}

export default function MessageBubble({ message, currentRole, chat }: Props) {
  const { socket } = useSocket();
  const [askDelete, setAskDelete] = useState(false);
  const [revealDeleted, setRevealDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { content, mediaUrl, readByRoles, createdAt, type, role, isDeleted, id } = message;

  const isOwn = role === currentRole;
  const isAdmin = currentRole === ROLE.ADMIN;
  const isSentByAdmin = role === ROLE.ADMIN;

  const sender =
    role === ROLE.USER
      ? chat.participants.user
      : role === ROLE.WORKER
        ? chat.participants.worker
        : null;

  const otherRole = role === ROLE.USER ? ROLE.WORKER : role === ROLE.WORKER ? ROLE.USER : null;
  const messageStatus =
    otherRole && readByRoles.includes(otherRole)
      ? 'read'
      : readByRoles.length > 0
        ? 'delivered'
        : 'sent';
  const StatusIcon = messageStatus === 'sent' ? Check : CheckCheck;
  const showDeletedPlaceholder = isDeleted && !(isAdmin && revealDeleted);

  const handleConfirmDelete = () => {
    socket?.emit('deleteMessage', { messageId: id, chatId: chat.id });
    setAskDelete(false);
  };

  return (
    <>
      <div className={cn('flex flex-col mb-2', isOwn ? 'items-end' : 'items-start')}>
        {isSentByAdmin && !isAdmin && (
          <span className="mb-0.5 ml-2 inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-section-blue-text">
            <span className="text-[9px]">✦</span> Admin
          </span>
        )}

        <div
          className={cn(
            'group flex items-end gap-2 w-full',
            isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          {!isOwn && isAdmin && sender && (
            <ProfileImage src={sender.profileImage} name={sender.name} size={30} />
          )}

          <div
            className={cn(
              'max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm',
              isOwn
                ? 'bg-primary text-primary-foreground rounded-br-sm'
                : isSentByAdmin
                  ? 'bg-blue-500/15 text-card-foreground  rounded-bl-sm'
                  : 'bg-card text-card-foreground rounded-bl-sm'
            )}
          >
            <div className="flex">
              {isAdmin && !isSentByAdmin && (
                <p
                  className={cn(
                    'mb-1 text-[12px] font-semibold',
                    isOwn
                      ? 'text-primary-foreground/80'
                      : role === ROLE.WORKER
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                  )}
                >
                  {sender?.name}{' '}
                  <span className="ml-1 opacity-60 font-normal text-[11px]">· {role} </span>
                </p>
              )}
              {isAdmin && isDeleted && (
                <Button
                  size="icon"
                  onClick={() => setRevealDeleted(v => !v)}
                  variant={revealDeleted ? 'outline' : 'secondary'}
                  className="ml-2 h-4 w-4 p-0 rounded-full"
                >
                  {' '}
                  {revealDeleted ? <EyeOff /> : <Eye />}
                </Button>
              )}
            </div>

            {showDeletedPlaceholder ? (
              <div className="flex ">
                <Ban className="mx-auto text-muted-foreground size-4 mr-2" />
                <p className="italic text-xs opacity-70">
                  {isOwn ? 'You deleted this message' : 'This message was deleted'}
                </p>
              </div>
            ) : (
              <>
                {type === MESSAGE_TYPE.TEXT && (
                  <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
                )}

                {type === MESSAGE_TYPE.IMAGE && (
                  <div className="space-y-1">
                    <div className="relative min-w-[220px]">
                      {loading && (
                        <div className="h-72 w-full rounded-xl">
                          <Skeleton className="h-full w-full rounded-xl" />
                        </div>
                      )}

                      {!error ? (
                        <img
                          src={mediaUrl}
                          alt="image"
                          onLoad={() => setLoading(false)}
                          onError={() => {
                            setLoading(false);
                            setError(true);
                          }}
                          className="max-h-72 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-40 items-center justify-center rounded-xl border">
                          Failed to load image
                        </div>
                      )}
                    </div>
                    {content && <p>{content}</p>}
                  </div>
                )}

                {type === MESSAGE_TYPE.VIDEO && (
                  <div className="space-y-1">
                    <video controls className="max-h-72 min-w-[260px] w-full rounded-xl">
                      <source src={mediaUrl} type="video/mp4" />
                    </video>
                    {content && <p className="pt-1">{content}</p>}
                  </div>
                )}

                {type === MESSAGE_TYPE.AUDIO && (
                  <div className="space-y-1">
                    <audio controls className="w-72 min-w-[260px] mt-1">
                      <source src={mediaUrl} />
                    </audio>
                    {content && <p className="pt-1">{content}</p>}
                  </div>
                )}
              </>
            )}

            {!showDeletedPlaceholder && (
              <>
                <div
                  className={cn(
                    'mt-1 flex items-center justify-end gap-1 text-[10px]',
                    isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
                >
                  <span>{formatChatDate(createdAt, 'time')}</span>
                  {isOwn && role !== ROLE.ADMIN && (
                    <StatusIcon
                      className={cn(
                        'h-3.5 w-3.5',
                        messageStatus === 'read' ? 'text-sky-400' : 'opacity-70'
                      )}
                    />
                  )}
                </div>

                {isAdmin && isOwn && role === ROLE.ADMIN && readByRoles.length > 0 && (
                  <div className="text-[10px] mt-1 opacity-70">
                    Read by: {readByRoles.join(', ')}
                  </div>
                )}
              </>
            )}
          </div>
          {isOwn && !isDeleted && (
            <button
              onClick={() => setAskDelete(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <AppModal
        open={askDelete}
        onClose={() => setAskDelete(false)}
        confirmText="Delete"
        isTitleHidden
        buttonVariant="red"
        onConfirm={handleConfirmDelete}
      >
        <div className="text-sm text-muted-foreground">
          This message will be removed for everyone in the chat. Admins will still be able to view
          the original content.
        </div>
      </AppModal>
    </>
  );
}
