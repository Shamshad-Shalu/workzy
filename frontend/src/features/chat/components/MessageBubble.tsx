import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  Pencil,
  Reply,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Button from '@/components/atoms/Button';
import { AppModal } from '@/components/molecules/AppModal';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Skeleton } from '@/components/ui/skeleton';
import { MESSAGE_TYPE, ROLE, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';
import { cn } from '@/lib/utils';
import type { Chat } from '@/types/chat';
import type { ChatMessage } from '@/types/chatMessage';
import { formatChatDate } from '@/utils/time.format';

interface Props {
  message: ChatMessage;
  currentRole: Role;
  chat: Chat;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (message: ChatMessage) => void;
  onJumpToMessage?: (messageId: string) => void;
  isPending?: boolean;
}

export default function MessageBubble({
  message,
  currentRole,
  chat,
  onReply,
  onEdit,
  onJumpToMessage,
  isPending = false,
}: Props) {
  const { socket } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [askDelete, setAskDelete] = useState(false);
  const [revealDeleted, setRevealDeleted] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isMediaPreviewOpen, setIsMediaPreviewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { content, mediaUrl, readByRoles, createdAt, type, role, isDeleted, id, isEdited } =
    message;

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
  const messageStatus = isPending
    ? 'pending'
    : otherRole && readByRoles.includes(otherRole)
      ? 'read'
      : readByRoles.length > 0
        ? 'delivered'
        : 'sent';

  const showDeletedPlaceholder = isDeleted && !(isAdmin && revealDeleted);
  const canDelete =
    isOwn && !isDeleted && !chat.isBlocked && dayjs().diff(dayjs(createdAt), 'hour') < 2;
  const canEdit =
    isOwn &&
    !isDeleted &&
    type === MESSAGE_TYPE.TEXT &&
    !chat.isBlocked &&
    dayjs().diff(dayjs(createdAt), 'hour') < 2;

  // Close context menu on outside click
  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const close = () => setMenuOpen(false);
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', close);
    };
  }, [menuOpen]);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 5, left: rect.left - 110 });
    setMenuOpen(true);
  };

  const handleConfirmDelete = () => {
    socket?.emit('deleteMessage', { messageId: id, chatId: chat.id });
    setAskDelete(false);
  };

  const StatusIcon = isPending ? Clock : messageStatus === 'sent' ? Check : CheckCheck;

  const menuButton = !showDeletedPlaceholder && (isOwn || isAdmin || onReply) && (
    <button
      onClick={openMenu}
      className={cn(
        'absolute -top-2 z-10 w-6 h-6 rounded-full flex items-center justify-center',
        'opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border',
        isOwn
          ? '-left-2 bg-primary border-primary/60 text-primary-foreground hover:bg-primary/90'
          : '-right-2 bg-card border-border text-muted-foreground hover:text-foreground'
      )}
    >
      <ChevronDown size={13} />
    </button>
  );

  const replyBlock = message.replyTo && !showDeletedPlaceholder && (
    <div
      onClick={() => message.replyTo?.messageId && onJumpToMessage?.(message.replyTo.messageId)}
      className={cn(
        'border-l-4 p-2 rounded mb-2 text-xs cursor-pointer transition-colors',
        isOwn
          ? 'bg-background/20 border-primary-foreground/60 hover:bg-background/30'
          : 'bg-muted/60 border-primary hover:bg-muted/80'
      )}
    >
      <p
        className={cn(
          'font-bold text-[10px] mb-0.5',
          isOwn ? 'text-primary-foreground/80' : 'text-primary'
        )}
      >
        {message.replyTo.role === currentRole ? 'You' : message.replyTo.role}
      </p>
      <p className="truncate opacity-80">
        {message.replyTo.type === MESSAGE_TYPE.TEXT
          ? message.replyTo.content
          : message.replyTo.type === MESSAGE_TYPE.IMAGE
            ? '📷 Photo'
            : message.replyTo.type === MESSAGE_TYPE.VIDEO
              ? '🎥 Video'
              : message.replyTo.type === MESSAGE_TYPE.AUDIO
                ? '🎵 Audio'
                : 'Media'}
      </p>
    </div>
  );

  return (
    <>
      <div className={cn('flex flex-col mb-1 w-full', isOwn ? 'items-end' : 'items-start')}>
        {/* Admin sender label */}
        {isSentByAdmin && !isAdmin && (
          <span className="mb-0.5 ml-2 inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-blue-500">
            <span className="text-[9px]">✦</span> Admin
          </span>
        )}

        <div className={cn('flex items-end gap-2 w-full', isOwn ? 'flex-row-reverse' : 'flex-row')}>
          {/* Avatar for admin view */}
          {!isOwn && isAdmin && sender && (
            <ProfileImage src={sender.profileImage} name={sender.name} size={30} />
          )}

          {/* Bubble wrapper with max width */}
          <div className={cn('relative group max-w-[78%]', isOwn ? 'self-end' : 'self-start')}>
            {menuButton}

            <div
              className={cn(
                'rounded-2xl px-3 py-2 text-sm shadow-sm',
                isOwn
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : isSentByAdmin
                    ? 'bg-blue-500/15 text-card-foreground border border-blue-500/20 rounded-tl-none'
                    : 'bg-card text-card-foreground border border-border rounded-tl-none'
              )}
            >
              <div className="flex">
                {isAdmin && !isSentByAdmin && sender && (
                  <p
                    className={cn(
                      'mb-1 text-[11px] font-semibold',
                      role === ROLE.WORKER ? 'text-sky-500' : 'text-emerald-500'
                    )}
                  >
                    {sender.name}
                    <span className="ml-1 opacity-50 font-normal">· {role}</span>
                  </p>
                )}
                {isAdmin && isDeleted && (
                  <Button
                    size="icon"
                    onClick={() => setRevealDeleted(v => !v)}
                    variant={revealDeleted ? 'outline' : 'secondary'}
                    className="ml-1 h-4 w-4 p-0 rounded-full"
                  >
                    {revealDeleted ? <EyeOff size={11} /> : <Eye size={11} />}
                  </Button>
                )}
              </div>
              {replyBlock}
              {showDeletedPlaceholder ? (
                <div className="flex items-center gap-1.5 italic opacity-60">
                  <Ban size={13} />
                  <span className="text-xs">
                    {isOwn ? 'You deleted this message' : 'This message was deleted'}
                  </span>
                </div>
              ) : (
                <>
                  {/* TEXT */}
                  {type === MESSAGE_TYPE.TEXT && (
                    <p className="whitespace-pre-wrap leading-relaxed break-words">{content}</p>
                  )}

                  {/* IMAGE */}
                  {type === MESSAGE_TYPE.IMAGE && (
                    <div className="space-y-1">
                      <div className="relative min-w-[200px] max-w-[260px] overflow-hidden rounded-xl">
                        {imgLoading && <Skeleton className="h-48 w-full rounded-xl" />}
                        {!imgError ? (
                          <img
                            src={mediaUrl}
                            alt="image"
                            onLoad={() => setImgLoading(false)}
                            onError={() => {
                              setImgLoading(false);
                              setImgError(true);
                            }}
                            className={cn(
                              'w-64 h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-300',
                              imgLoading && 'hidden'
                            )}
                            onClick={() => setIsMediaPreviewOpen(true)}
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center rounded-xl border text-xs text-muted-foreground">
                            Failed to load
                          </div>
                        )}
                      </div>
                      {content && <p className="text-sm mt-1">{content}</p>}
                    </div>
                  )}

                  {/* VIDEO */}
                  {type === MESSAGE_TYPE.VIDEO && (
                    <div className="space-y-1">
                      <div
                        className="relative rounded-xl overflow-hidden border border-border bg-card cursor-pointer group/video w-64 h-48 flex items-center justify-center"
                        onClick={() => setIsMediaPreviewOpen(true)}
                      >
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-cover opacity-80"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/video:bg-black/35 transition-colors">
                          <div className="bg-black/60 text-white rounded-full p-3 group-hover/video:scale-110 transition-all duration-300 shadow-md">
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {content && <p className="text-sm mt-1">{content}</p>}
                    </div>
                  )}

                  {/* AUDIO */}
                  {type === MESSAGE_TYPE.AUDIO && (
                    <div className="space-y-1">
                      <audio controls className="w-56 min-w-[200px] mt-1">
                        <source src={mediaUrl} />
                      </audio>
                      {content && <p className="text-sm mt-1">{content}</p>}
                    </div>
                  )}
                </>
              )}
            </div>

            {!showDeletedPlaceholder && (
              <div
                className={cn(
                  'flex items-center gap-1 mt-0.5 px-1',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                <span className="text-[10px] text-muted-foreground">
                  {formatChatDate(createdAt, 'time')}
                  {isEdited && !isDeleted && <span className="ml-1 opacity-60">(edited)</span>}
                </span>
                {isOwn && role !== ROLE.ADMIN && (
                  <StatusIcon
                    size={13}
                    className={cn(
                      isPending
                        ? 'text-muted-foreground/50 animate-pulse'
                        : messageStatus === 'read'
                          ? 'text-primary'
                          : 'text-muted-foreground'
                    )}
                  />
                )}
                {isAdmin && isOwn && role === ROLE.ADMIN && readByRoles.length > 0 && (
                  <span className="text-[10px] text-muted-foreground opacity-60">
                    Read by: {readByRoles.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[140px] bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl py-1.5"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={e => e.stopPropagation()}
        >
          {onReply && !isDeleted && (
            <button
              onClick={() => {
                onReply(message);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 text-sm"
            >
              <Reply size={14} /> Reply
            </button>
          )}
          {canEdit && onEdit && (
            <button
              onClick={() => {
                onEdit(message);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 text-sm"
            >
              <Pencil size={14} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => {
                setAskDelete(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 text-sm text-destructive"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
          {!onReply && !canEdit && !canDelete && (
            <p className="px-4 py-2 text-xs text-muted-foreground">No actions</p>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      <AppModal
        open={askDelete}
        onClose={() => setAskDelete(false)}
        confirmText="Delete"
        isTitleHidden
        buttonVariant="red"
        onConfirm={handleConfirmDelete}
      >
        <div className="text-sm text-muted-foreground">
          This message will be removed for everyone. Admins can still view the original content.
        </div>
      </AppModal>

      {/* Fullscreen media preview lightbox */}
      {createPortal(
        <AnimatePresence>
          {isMediaPreviewOpen && !isDeleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMediaPreviewOpen(false)}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md cursor-zoom-out"
            >
              <button
                onClick={() => setIsMediaPreviewOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all shadow-lg"
                title="Close"
              >
                <X size={20} />
              </button>
              <motion.div
                initial={{ scale: 0.96, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 12 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative max-w-5xl max-h-[80vh] overflow-hidden flex flex-col items-center"
                onClick={e => e.stopPropagation()}
              >
                {type === MESSAGE_TYPE.IMAGE ? (
                  <img
                    src={mediaUrl}
                    alt="Full screen preview"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl select-none"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                  />
                )}
                {content && (
                  <div className="mt-3 px-4 py-2 bg-black/60 backdrop-blur-sm text-white text-sm rounded-lg max-w-md text-center">
                    {content}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
