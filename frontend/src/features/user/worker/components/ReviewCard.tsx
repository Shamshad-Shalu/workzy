import { motion } from 'framer-motion';
import { ImageIcon, MessageSquare, Pencil, Play } from 'lucide-react';

import { StarRating } from '@/components/atoms/StarRating';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import type { EvidenceItem } from '@/types/booking';
import type { PublicReviewView } from '@/types/review';
import { formatDate } from '@/utils/time.format';

interface ReviewCardProps {
  review: PublicReviewView;
  onOpenMedia: (items: EvidenceItem[], index: number) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
} as const;

export default function ReviewCard({ review, onOpenMedia }: ReviewCardProps) {
  const { user, category, createdAt, id, isEdited, rating, media, reply, reviewText } = review;

  return (
    <motion.div
      key={id}
      variants={cardVariants}
      layout
      className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ProfileImage src={user.profileImage} size={40} name={user.name} />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{user.name}</p>
              {isEdited && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <Pencil size={10} />
                  edited
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-xs text-muted-foreground">{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {review.media && review.media.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              <ImageIcon size={11} />
              {review.media.length}
            </span>
          )}
          <Badge variant="secondary" className="shrink-0 text-xs">
            {category.name}
          </Badge>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{reviewText}</p>
      {media && media.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {media.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => onOpenMedia(media, i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative shrink-0 overflow-hidden rounded-lg border border-border/50"
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Review media ${i + 1}`}
                  className="h-24 w-32 object-cover sm:h-28 sm:w-36"
                  loading="lazy"
                />
              ) : (
                <div className="relative flex h-24 w-32 items-center justify-center bg-muted sm:h-28 sm:w-36 overflow-hidden rounded-md">
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <Play size={28} className="absolute text-white opacity-80" />

                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    Video
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
      {reply && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-3 rounded-lg border border-primary/10 bg-primary/5 p-3"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <MessageSquare size={13} />
            Your Reply
            <span className="ml-1 font-normal text-muted-foreground">
              · {formatDate(reply?.repliedAt)}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{reply?.message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
