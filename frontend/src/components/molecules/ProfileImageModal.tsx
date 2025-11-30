import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  image: string;
}

export default function ProfileImageModal({ open, onOpenChange, image }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <img src={image} alt="Profile image" className="rounded-lg w-full" />
      </DialogContent>
    </Dialog>
  );
}
