import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { cn } from '@/lib/utils';

import Button from '../atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import type React from 'react';

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  isDescriptionHidden?: boolean;
  isTitleHidden?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  isConfirmLoading?: boolean;
  footer?: React.ReactNode;
  canCloseOnOutsideClick?: boolean;
}

export function AppModal({
  open,
  onClose,
  children,
  title = 'Confirm Action',
  description = 'Please review the details and confirm the action.',
  isDescriptionHidden = true,
  isTitleHidden = false,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirmLoading = false,
  footer,
  canCloseOnOutsideClick = true,
  className = 'sm:max-w-lg',
}: AppModalProps) {
  const TitleComponent = isTitleHidden ? (
    <VisuallyHidden>
      <DialogTitle>{title}</DialogTitle>
    </VisuallyHidden>
  ) : (
    <DialogTitle>{title}</DialogTitle>
  );

  const DefaultFooter = (onConfirm || !footer) && !footer && (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={isConfirmLoading}>
        {cancelText}
      </Button>
      {onConfirm && (
        <Button onClick={onConfirm} disabled={isConfirmLoading} loading={isConfirmLoading}>
          {confirmText}
        </Button>
      )}
    </DialogFooter>
  );
  const handleOpenChange = (newOpenState: boolean) => {
    if (newOpenState === false && canCloseOnOutsideClick) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn('max-h-[90vh] flex flex-col', className)}>
        <DialogHeader className="flex-shrink-0">
          {TitleComponent}
          {description &&
            (isDescriptionHidden ? (
              <VisuallyHidden>
                <DialogDescription>{description}</DialogDescription>
              </VisuallyHidden>
            ) : (
              <DialogDescription>{description}</DialogDescription>
            ))}
        </DialogHeader>
        <div className="py-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">{children}</div>
        {footer || DefaultFooter}
      </DialogContent>
    </Dialog>
  );
}
