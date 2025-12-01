import { Dialog, DialogContent } from '@/components/ui/dialog';

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
      <DialogContent>
        <img src={profileImage} alt="Profile image" className="rounded-lg w-full" />
      </DialogContent>
    </Dialog>
  );
}
