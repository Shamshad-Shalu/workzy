// import { motion } from 'framer-motion';
// import { Eye, EyeOff, MessageSquare, Pencil, Play } from 'lucide-react';

// import { StarRating } from '@/components/atoms/StarRating';
// import ProfileImage from '@/components/molecules/ProfileImage';
// import { Badge } from '@/components/ui/badge';
// import type { EvidenceItem } from '@/types/booking';
// import type { AdminReviewView } from '@/types/review';
// import { formatReviewDate } from '@/utils/time.format';
// import { cn } from '@/lib/utils';
// import Button from '@/components/atoms/Button';

// interface ReviewCardProps {
//   review: AdminReviewView;
//   onOpenMedia: (items: EvidenceItem[], index: number) => void;
//   onToggleReview?: (review: AdminReviewView) => void;
// }

// const cardVariants = {
//   hidden: { opacity: 0, y: 16 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
//   exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
// } as const;

// export default function AdminReviewCard({ review, onOpenMedia, onToggleReview }: ReviewCardProps) {
//   const {
//     user,
//     worker,
//     isHidden,
//     category,
//     createdAt,
//     id,
//     isEdited,
//     rating,
//     media,
//     reply,
//     reviewText,
//   } = review;

//   return (
//     <motion.div
//       key={id}
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       layout
//       className={cn(
//         'group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md',
//         isHidden ? 'opacity-70' : ''
//       )}
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 border-b border-border/50 pb-4">
//         <div className="space-y-3">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <PartyBlock label="Customer" party={user} />
//             <PartyBlock label="Worker" party={worker} />
//           </div>
//           <div className="flex flex-wrap items-center gap-3">
//             <StarRating rating={rating} />
//             <span className="text-sm font-medium">{rating}</span>
//             <span className="text-xs text-muted-foreground">{formatReviewDate(createdAt)}</span>

//             {isEdited && (
//               <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                 <Pencil size={10} />
//                 edited
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex flex-wrap items-start gap-2 justify-start sm:justify-end">
//           <Badge variant="outline">{category.name}</Badge>
//           {isHidden && (
//             <Badge variant="destructive" className="gap-1">
//               <EyeOff size={11} />
//               Hidden
//             </Badge>
//           )}
//         </div>
//       </div>
//       {media && media.length > 0 && (
//         <div className="mt-3 flex gap-2 overflow-x-auto">
//           {media.map((item, i) => (
//             <motion.button
//               key={i}
//               onClick={() => onOpenMedia(media, i)}
//               whileHover={{ scale: 1.04 }}
//               whileTap={{ scale: 0.97 }}
//               className="relative shrink-0 overflow-hidden rounded-lg border border-border/50"
//             >
//               {item.type === 'image' ? (
//                 <img
//                   src={item.url}
//                   alt={`Review media ${i + 1}`}
//                   className="h-24 w-32 object-cover sm:h-28 sm:w-36"
//                   loading="lazy"
//                 />
//               ) : (
//                 <div className="relative flex h-24 w-32 items-center justify-center bg-muted sm:h-28 sm:w-36 overflow-hidden rounded-md">
//                   <video
//                     src={item.url}
//                     className="h-full w-full object-cover"
//                     muted
//                     preload="metadata"
//                   />
//                   <div className="absolute inset-0 bg-black/30" />
//                   <Play size={28} className="absolute text-white opacity-80" />

//                   <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
//                     Video
//                   </span>
//                 </div>
//               )}
//             </motion.button>
//           ))}
//         </div>
//       )}
//       {reply && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: 'auto' }}
//           transition={{ duration: 0.3 }}
//           className="mt-3 rounded-lg border border-primary/10 bg-primary/5 p-3"
//         >
//           <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
//             <MessageSquare size={12} />
//             Worker replied
//             <span className="ml-1 font-normal text-muted-foreground">
//               · {formatReviewDate(reply?.repliedAt)}
//             </span>
//           </div>
//           <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 line-clamp-2">
//             {reply?.message}
//           </p>
//         </motion.div>
//       )}
//       <motion.div whileTap={{ scale: 0.97 }}>
//         <Button
//           variant={isHidden ? 'primary' : 'outline'}
//           size="sm"
//           onClick={() => onToggleReview?.(review)}
//           iconLeft={isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
//         >
//           {isHidden ? 'Unhide' : 'Hide'}
//         </Button>
//       </motion.div>
//     </motion.div>
//   );
// }

// interface PartyInfo {
//   id: string;
//   name: string;
//   profileImage: string;
//   phone?: string;
// }

// function PartyBlock({ label, party }: { label: string; party: PartyInfo }) {
//   return (
//     <div className="flex items-start gap-2.5 min-w-0">
//       <ProfileImage src={party.profileImage} size={40} />
//       <div className="min-w-0">
//         <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
//           {label}
//         </p>
//         <p className="truncate text-sm font-semibold text-foreground">{party.name}</p>
//         {party.phone && <p className="truncate text-[11px] text-muted-foreground">{party.phone}</p>}
//       </div>
//     </div>
//   );
// }

import { motion } from 'framer-motion';
import { Eye, EyeOff, MessageSquare, Pencil, Play } from 'lucide-react';

import Button from '@/components/atoms/Button';
import { StarRating } from '@/components/atoms/StarRating';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { EvidenceItem } from '@/types/booking';
import type { AdminReviewView } from '@/types/review';
import { formatReviewDate } from '@/utils/time.format';

interface ReviewCardProps {
  review: AdminReviewView;
  onOpenMedia: (items: EvidenceItem[], index: number) => void;
  onToggleReview?: (review: AdminReviewView) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
} as const;

export default function AdminReviewCard({ review, onOpenMedia, onToggleReview }: ReviewCardProps) {
  const {
    user,
    worker,
    isHidden,
    category,
    createdAt,
    isEdited,
    rating,
    media,
    reply,
    reviewText,
  } = review;

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'group relative rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition-colors',
        isHidden && 'bg-muted/40 opacity-90'
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <PartyBlock label="Customer" party={user} />
          <span className="h-8 w-px bg-border/70" />
          <PartyBlock label="Worker" party={worker} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Badge variant="secondary" className="text-[11px]">
            {category.name}
          </Badge>
          {isHidden && (
            <Badge variant="red" className="gap-1 text-[11px]">
              <EyeOff className="h-3 w-3" />
              Hidden
            </Badge>
          )}
        </div>
      </header>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <StarRating rating={rating} />
        <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        <span>·</span>
        <span>{formatReviewDate(createdAt)}</span>
        {isEdited && (
          <span className="inline-flex items-center gap-1">
            <span>·</span>
            <Pencil className="h-3 w-3" />
            edited
          </span>
        )}
      </div>

      {reviewText && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{reviewText}</p>
      )}

      {media && media.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => onOpenMedia(media, i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border/50"
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="relative h-full w-full bg-black/80">
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                  <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[9px] text-white">
                    Video
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {reply && (
        <div className="mt-2 rounded-lg border border-border/50 bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span className="font-medium text-foreground">Worker replied</span>
            <span>· {formatReviewDate(reply.repliedAt)}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90">{reply.message}</p>
        </div>
      )}

      <div className="mt-2 flex justify-end border-t border-border/40 pt-2">
        <Button
          variant={isHidden ? 'green' : 'red'}
          size="sm"
          onClick={() => onToggleReview?.(review)}
          iconLeft={isHidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          className="h-7 px-2 text-xs"
        >
          {isHidden ? 'Unhide' : 'Hide'}
        </Button>
      </div>
    </motion.article>
  );
}

interface PartyInfo {
  id: string;
  name: string;
  profileImage: string;
  phone?: string;
}

function PartyBlock({ label, party }: { label: string; party: PartyInfo }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <ProfileImage src={party.profileImage} name={party.name} size={32} />
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-foreground">{party.name}</p>
        {party.phone && <p className="truncate text-[11px] text-muted-foreground">{party.phone}</p>}
      </div>
    </div>
  );
}
