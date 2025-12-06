import Button from '../atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  name?: string;
  fromStatus: string;
  loading?: boolean;
  toStatus: string;
  onConfirm: () => void;
}

export default function StatusChangeModal({
  open,
  onClose,
  fromStatus,
  loading = false,
  name = '',
  toStatus,
  onConfirm,
}: StatusChangeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Change Status from <b>{fromStatus}</b> to <b>{toStatus}</b>
          </DialogTitle>
          <DialogDescription>
            {name && (
              <span className="block mb-2">
                Are you sure you want to update <b>{name}</b>'s status?
              </span>
            )}
            This action will update the user's workflow immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              onConfirm();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
