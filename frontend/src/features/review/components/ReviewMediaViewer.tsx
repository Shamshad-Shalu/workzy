import { AnimatePresence } from 'framer-motion';

import { MediaViewer } from '@/components/organisms/MediaViewer';
import type { EvidenceItem } from '@/types/booking';

import type { Dispatch, SetStateAction } from 'react';

type ReviewMediaViewerProps = {
  previewIndex: number | null;
  mediaItems: EvidenceItem[];
  onClose: () => void;
  setPreviewIndex: Dispatch<SetStateAction<number | null>>;
};

export function ReviewMediaViewer({
  previewIndex,
  mediaItems,
  onClose,
  setPreviewIndex,
}: ReviewMediaViewerProps) {
  if (previewIndex === null || !mediaItems[previewIndex]) {
    return null;
  }

  const handlePrev = () =>
    setPreviewIndex(current => (current === null ? null : Math.max(0, current - 1)));

  const handleNext = () =>
    setPreviewIndex(current =>
      current === null ? null : Math.min(mediaItems.length - 1, current + 1)
    );

  return (
    <AnimatePresence>
      {previewIndex !== null && mediaItems[previewIndex] && (
        <MediaViewer
          item={mediaItems[previewIndex]}
          onClose={onClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={previewIndex > 0}
          hasNext={previewIndex < mediaItems.length - 1}
          counter={`${previewIndex + 1} / ${mediaItems.length}`}
        />
      )}
    </AnimatePresence>
  );
}
