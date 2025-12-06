import { useState } from 'react';
import type { UserRow } from '@/types/admin/user';
import ProfileImage from '@/components/molecules/ProfileImage';
import { StatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface Props {
  item: UserRow;
  index?: number;
  onView?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

export default function DataTableMobileCard({ item, onView, onToggleStatus }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border rounded-lg p-3 my-3">
      <div className="flex items-center gap-3">
        <ProfileImage src={item.profileImage} size={48} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.email}</div>
            </div>
            <div className="flex flex-col items-end">
              <StatusBadge
                label={item.isBlocked ? 'Blocked' : 'Active'}
                status={item.isBlocked ? 'error' : 'success'}
              />
              <button className="mt-2" onClick={() => setOpen(o => !o)} aria-label="expand">
                {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* collapsed (M1): only above is visible. when expanded show extra */}
      {open && (
        <div className="mt-3 text-sm text-muted-foreground grid grid-cols-1 gap-2">
          <div>Phone: {item.phone ?? '-'}</div>
          <div>Joined: {item.createdAt}</div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              iconLeft={<Eye className="w-4 h-4" />}
              onClick={() => onView?.(item._id)}
            >
              View
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onToggleStatus?.(item._id)}>
              {item.isBlocked ? 'Unblock' : 'Block'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from 'react';
// import type { UserRow } from '@/types/admin/user';
// import ProfileImage from '@/components/molecules/ProfileImage';
// import { StatusBadge } from '@/components/atoms/Badge';
// import Button from '@/components/atoms/Button';
// import { ChevronDown, ChevronUp, Eye } from 'lucide-react';

// interface Props {
// item: UserRow;
// index?: number;
// onView?: (id: string) => void;
// onToggleStatus?: (id: string) => void;
// }

// export default function DataTableMobileCard({ item, onView, onToggleStatus }: Props) {
// const [open, setOpen] = useState(false);

// return (
// <div className="bg-card border rounded-lg p-3 mb-3">
// <div className="flex items-center gap-3">
// <ProfileImage src={item.profileImage} size={30} />
// <div className="flex-1">
// <div className="flex items-center justify-between">
// <div>
// <div className="font-medium">{item.name}</div>
// <div className="text-xs text-muted-foreground">{item.email}</div>
// </div>
// <div className="flex flex-col items-end">
// <StatusBadge label={item.isBlocked ? 'Blocked' : 'Active'} status={item.isBlocked ? 'error' : 'success'} />
// <button className="mt-2" onClick={() => setOpen(o => !o)} aria-label="expand">
// {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
// </button>
// </div>
// </div>
// </div>
// </div>

// {/* collapsed (M1): only above is visible. when expanded show extra */}
// {open && (
// <div className="mt-3 text-sm text-muted-foreground grid grid-cols-1 gap-2">
// <div>Phone: {item.phone ?? '-'}</div>
// <div>Joined: {item.createdAt}</div>
// <div className="flex items-center gap-2 mt-2">
// <Button size="sm" variant="outline" iconLeft={<Eye className="w-4 h-4" />} onClick={() => onView?.(item._id)}>
// View
// </Button>
// <Button size="sm" variant="secondary" onClick={() => onToggleStatus?.(item._id)}>
// {item.isBlocked ? 'Unblock' : 'Block'}
// </Button>
// </div>
// </div>
// )}
// </div>
// );
// }
