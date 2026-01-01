import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  image: string | undefined;
}

export default function ProfileImageModal({ open, onOpenChange, image }: Props) {
  const profileImage =
    image ||
    'https://res.cloudinary.com/dhvlhpg55/image/upload/v1740028408/nexus/images/oamn3bzchpmixago65yf.jpg';
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Image</DialogTitle>
          <DialogDescription>Image</DialogDescription>
        </VisuallyHidden>
      </DialogHeader>
      <DialogContent
        className="
         p-0 border-none w-[400px] h-[400px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
         "
      >
        <img
          src={profileImage}
          alt="Profile image"
          className="rounded-lg w-full h-full object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}
