import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  Film,
  Image as ImageIcon,
  Mic,
  Music,
  Paperclip,
  Pencil,
  Send,
  Shield,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { MESSAGE_TYPE, ROLE, type MessageType, type Role } from '@/constants';
import { useSocket } from '@/context/socket/use-socket';

import {
  CHAT_AUDIO_ACCEPT,
  CHAT_IMAGE_ACCEPT,
  CHAT_UPLOAD_LIMITS,
  CHAT_VIDEO_ACCEPT,
  normalizeMimeType,
} from '../constants/chatUpload';
import { useChatMediaUpload } from '../hooks/useChatMediaUpload';
import { messageInputSchema, type MessageInputFormValues } from '../validation/messageInputSchema';

export interface SentMessagePayload {
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  duration?: string;
}

interface MessageInputProps {
  chatId: string;
  role: Role;
  onLocalMessage?: (payload: SentMessagePayload) => void;
  disabled?: boolean;
  replyTo?: {
    messageId: string;
    content?: string;
    type: MessageType;
    role: Role;
  } | null;
  onCancelReply?: () => void;
  /** For edit mode: the message id being edited */
  editingMessageId?: string | null;
  /** For edit mode: pre-filled content */
  editingContent?: string;
  onCancelEdit?: () => void;
  onSubmitEdit?: (messageId: string, content: string) => void;
}

interface PendingAttachment {
  id: string;
  file: File;
  type: MessageType;
  previewUrl: string;
  duration?: string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function resolveMediaType(file: File): MessageType | null {
  const mime = normalizeMimeType(file.type);
  if (mime.startsWith('video/')) {
    return MESSAGE_TYPE.VIDEO;
  }
  if (mime.startsWith('image/')) {
    return MESSAGE_TYPE.IMAGE;
  }
  if (mime.startsWith('audio/')) {
    return MESSAGE_TYPE.AUDIO;
  }
  return null;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function MediaPreview({
  attachment,
  onRemove,
  disabled,
}: {
  attachment: PendingAttachment;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const { type, previewUrl, duration } = attachment;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 px-3 py-2.5 mb-2">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
        {type === MESSAGE_TYPE.IMAGE && (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        )}
        {type === MESSAGE_TYPE.VIDEO && (
          <>
            <video src={previewUrl} className="h-full w-full object-cover" muted />
            <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white">
              <Film className="h-2.5 w-2.5" /> VIDEO
            </span>
          </>
        )}
        {type === MESSAGE_TYPE.AUDIO && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-primary/10 text-primary">
            <Music className="h-5 w-5" />
            {duration && <span className="text-[10px] font-medium tabular-nums">{duration}</span>}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground truncate">
          {type === MESSAGE_TYPE.AUDIO
            ? duration
              ? `Voice message · ${duration}`
              : 'Audio file'
            : type === MESSAGE_TYPE.VIDEO
              ? 'Video'
              : 'Image'}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {type === MESSAGE_TYPE.AUDIO ? 'Ready to send' : 'Add a caption (optional) and send'}
        </p>
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove attachment"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function UploadProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 mb-2">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{progress}%</span>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function MessageInput({
  chatId,
  role,
  onLocalMessage,
  disabled = false,
  replyTo,
  onCancelReply,
  editingMessageId,
  editingContent,
  onCancelEdit,
  onSubmitEdit,
}: MessageInputProps) {
  const { socket } = useSocket();
  const { uploadMedia, uploading, uploadProgress } = useChatMediaUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const attachPopoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordSecondsRef = useRef(0);

  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [sending, setSending] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const [attachOpen, setAttachOpen] = useState(false);

  const isEditing = Boolean(editingMessageId);
  const isAdmin = role === ROLE.ADMIN;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MessageInputFormValues>({
    resolver: zodResolver(messageInputSchema),
    defaultValues: { content: '' },
  });

  // When entering edit mode, pre-fill the textarea
  useEffect(() => {
    if (editingMessageId && editingContent !== undefined) {
      setValue('content', editingContent);
      textareaRef.current?.focus();
    }
  }, [editingMessageId, editingContent, setValue]);

  const content = watch('content');
  const hasText = Boolean(content.trim());
  const canSend = hasText || Boolean(pendingAttachment);
  const isBusy = sending || uploading || disabled;

  // Close attach popover on outside click
  useEffect(() => {
    if (!attachOpen) {
      return;
    }
    const close = () => setAttachOpen(false);
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', close);
    };
  }, [attachOpen]);

  const clearPendingAttachment = useCallback(() => {
    setPendingAttachment(prev => {
      if (prev?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (pendingAttachment?.previewUrl) {
        URL.revokeObjectURL(pendingAttachment.previewUrl);
      }
    };
  }, [pendingAttachment?.previewUrl]);

  // Recording timer
  useEffect(() => {
    if (!recording) {
      return;
    }
    setRecordSeconds(0);
    recordSecondsRef.current = 0;
    const id = setInterval(() => {
      setRecordSeconds(s => {
        recordSecondsRef.current = s + 1;
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [recording]);

  const emitMessage = (payload: SentMessagePayload) => {
    if (onLocalMessage) {
      onLocalMessage(payload);
      return;
    }
    if (!socket) {
      toast.error('Not connected to chat');
      return;
    }
    socket.emit('sendMessage', {
      chatId,
      type: payload.type,
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      replyToMessageId: replyTo?.messageId,
    });
    onCancelReply?.();
  };

  const attachFile = (file: File, type: MessageType, duration?: string) => {
    clearPendingAttachment();
    const previewUrl = type === MESSAGE_TYPE.AUDIO ? '' : URL.createObjectURL(file);
    setPendingAttachment({ id: crypto.randomUUID(), file, type, previewUrl, duration });
    setAttachOpen(false);
  };

  const handleSend = async (values: MessageInputFormValues) => {
    const caption = values.content.trim();

    // Edit mode: emit editMessage socket event
    if (isEditing && editingMessageId) {
      if (!caption) {
        return;
      }
      onSubmitEdit?.(editingMessageId, caption);
      reset({ content: '' });
      return;
    }

    if (!caption && !pendingAttachment) {
      return;
    }

    setSending(true);
    try {
      if (pendingAttachment) {
        const { file, type, duration } = pendingAttachment;
        const mediaUrl = await uploadMedia(file, type);
        emitMessage({
          type,
          mediaUrl,
          content: caption || undefined,
          duration: type === MESSAGE_TYPE.AUDIO ? duration : undefined,
        });
        clearPendingAttachment();
        reset({ content: '' });
        return;
      }
      emitMessage({ type: MESSAGE_TYPE.TEXT, content: caption });
      reset({ content: '' });
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files ?? [])[0];
    e.target.value = '';
    if (!file) {
      return;
    }
    const type = resolveMediaType(file);
    if (!type || (type !== MESSAGE_TYPE.IMAGE && type !== MESSAGE_TYPE.VIDEO)) {
      toast.error(`${file.name}: unsupported file type`);
      return;
    }
    const maxMb =
      type === MESSAGE_TYPE.VIDEO ? CHAT_UPLOAD_LIMITS.videoMB : CHAT_UPLOAD_LIMITS.imageMB;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`${file.name} exceeds ${maxMb}MB`);
      return;
    }
    attachFile(file, type);
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files ?? [])[0];
    e.target.value = '';
    if (!file) {
      return;
    }
    const type = resolveMediaType(file);
    if (type !== MESSAGE_TYPE.AUDIO) {
      toast.error(`${file.name}: unsupported audio type`);
      return;
    }
    if (file.size > CHAT_UPLOAD_LIMITS.audioMB * 1024 * 1024) {
      toast.error(`${file.name} exceeds ${CHAT_UPLOAD_LIMITS.audioMB}MB`);
      return;
    }
    attachFile(file, MESSAGE_TYPE.AUDIO);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = ev => {
        if (ev.data.size > 0) {
          audioChunksRef.current.push(ev.data);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const cancelRecording = () => {
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current = null;
    setRecording(false);
  };

  const stopAndAttachVoice = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setRecording(false);
      return;
    }
    const duration = formatDuration(recordSecondsRef.current);
    recorder.onstop = () => {
      recorder.stream.getTracks().forEach(t => t.stop());
      const mime = normalizeMimeType(recorder.mimeType) || 'audio/webm';
      const ext = mime.includes('ogg') ? 'ogg' : 'webm';
      const blob = new Blob(audioChunksRef.current, { type: mime });
      const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mime });
      mediaRecorderRef.current = null;
      setRecording(false);
      attachFile(file, MESSAGE_TYPE.AUDIO, duration);
    };
    recorder.stop();
  };

  const sendBtnClass = isEditing
    ? 'flex items-center justify-center bg-emerald-500 text-white p-3 rounded-lg active:scale-95 transition-transform hover:bg-emerald-600 disabled:opacity-50'
    : isAdmin
      ? 'flex items-center justify-center bg-amber-500 text-white p-3 rounded-lg active:scale-95 transition-transform hover:bg-amber-600 disabled:opacity-50'
      : 'flex items-center justify-center bg-primary text-primary-foreground p-3 rounded-lg active:scale-95 transition-transform hover:bg-primary/90 disabled:opacity-50';

  const { ref: rhfRef, ...rhfRest } = register('content');

  return (
    <div className="border-t border-border bg-card px-4 py-3 shrink-0">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={`${CHAT_IMAGE_ACCEPT},${CHAT_VIDEO_ACCEPT}`}
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={audioFileInputRef}
        type="file"
        accept={CHAT_AUDIO_ACCEPT}
        className="hidden"
        onChange={handleAudioFileChange}
      />

      {uploading && <UploadProgressBar progress={uploadProgress} />}

      {recording ? (
        /* ── Recording UI ── */
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cancelRecording}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            title="Cancel"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-3 rounded-full bg-muted px-4 py-2.5">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-medium tabular-nums">
              {formatDuration(recordSeconds)}
            </span>
            <div className="flex flex-1 items-center gap-0.5">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full bg-primary/50"
                  style={{ height: `${6 + ((i * 53 + recordSeconds * 7) % 18)}px` }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={stopAndAttachVoice}
            className={sendBtnClass}
            title="Send voice"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleSend)} className="space-y-2">
          {/* Reply strip */}
          {replyTo && !isEditing && (
            <div className="bg-muted/60 border-l-4 border-primary rounded-lg p-3 flex items-start gap-4">
              <div className="flex-grow overflow-hidden">
                <p className="font-bold text-[12px] text-primary mb-1">
                  {replyTo.role === role ? 'You' : replyTo.role}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {replyTo.type === MESSAGE_TYPE.TEXT
                    ? replyTo.content
                    : replyTo.type === MESSAGE_TYPE.IMAGE
                      ? '📷 Photo'
                      : replyTo.type === MESSAGE_TYPE.VIDEO
                        ? '🎥 Video'
                        : '🎵 Audio'}
                </p>
              </div>
              <button
                type="button"
                onClick={onCancelReply}
                className="text-muted-foreground hover:text-destructive p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Edit mode strip */}
          {isEditing && (
            <div className="flex items-center gap-2 px-1 text-emerald-500">
              <Pencil size={13} />
              <span className="text-xs font-medium">Editing message</span>
              <button
                type="button"
                onClick={() => {
                  onCancelEdit?.();
                  reset({ content: '' });
                }}
                className="ml-auto text-muted-foreground hover:text-destructive p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Media preview */}
          {pendingAttachment && (
            <MediaPreview
              attachment={pendingAttachment}
              onRemove={clearPendingAttachment}
              disabled={isBusy}
            />
          )}

          {/* ── Main input row ── */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl p-1 pr-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Admin badge */}
            {isAdmin && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Shield className="h-4 w-4" />
              </div>
            )}

            {/* Attach popover */}
            {!isEditing && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={e => {
                    e.stopPropagation();
                    setAttachOpen(v => !v);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted disabled:opacity-50"
                  title="Attach"
                >
                  <Paperclip size={18} />
                </button>
                {attachOpen && (
                  <div
                    ref={attachPopoverRef}
                    className="absolute bottom-full left-0 mb-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-2xl py-1.5 w-40 z-50"
                    onClick={e => e.stopPropagation()}
                  >
                    {[
                      {
                        label: 'Image',
                        Icon: ImageIcon,
                        action: () => fileInputRef.current?.click(),
                      },
                      { label: 'Video', Icon: Film, action: () => fileInputRef.current?.click() },
                      {
                        label: 'Audio',
                        Icon: Music,
                        action: () => audioFileInputRef.current?.click(),
                      },
                    ].map(({ label, Icon, action }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          action();
                          setAttachOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-2 text-sm"
                      >
                        <Icon size={15} className="text-primary" /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Textarea */}
            <textarea
              rows={1}
              disabled={isBusy}
              placeholder={isEditing ? 'Edit message...' : 'Type your message...'}
              className="flex-grow bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground py-3 resize-none max-h-32 disabled:opacity-50"
              {...rhfRest}
              ref={el => {
                rhfRef(el);
                textareaRef.current = el;
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit(handleSend)();
                }
                if (e.key === 'Escape' && isEditing) {
                  onCancelEdit?.();
                  reset({ content: '' });
                }
              }}
            />

            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}

            {/* Send / Mic / Check buttons */}
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onCancelEdit?.();
                    reset({ content: '' });
                  }}
                  className="text-muted-foreground hover:text-destructive p-2 rounded-lg transition-colors"
                  title="Cancel edit"
                >
                  <X size={17} />
                </button>
                <button
                  type="submit"
                  disabled={isBusy || !hasText}
                  className={sendBtnClass}
                  title="Save edit"
                >
                  <Check size={17} />
                </button>
              </>
            ) : canSend ? (
              <button type="submit" disabled={isBusy} className={sendBtnClass} title="Send message">
                <Send size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startRecording()}
                disabled={isBusy}
                className={sendBtnClass}
                title="Record voice"
              >
                <Mic size={17} />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
