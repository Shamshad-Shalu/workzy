import type { ColumnDef } from '@tanstack/react-table';
import type { UserRow } from '@/types/admin/user';
import ProfileImage from '@/components/molecules/ProfileImage';
import { StatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { Eye } from 'lucide-react';

/** Factory that returns column defs for the user table */
export const userColumns = (
  openStatusModal: (user: UserRow) => void,
  openView: (id: string) => void
): ColumnDef<UserRow>[] => [
  {
    accessorKey: '_id',
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const idx =
        row.index +
        1 +
        (table.getState().pagination.pageIndex ?? 0) * (table.getState().pagination.pageSize ?? 0);
      return <div className="text-sm text-muted-foreground">{idx}</div>;
    },
    size: 60,
  },
  {
    accessorKey: 'name',
    header: () => (
      <div className="flex items-center gap-2 bg-baground">
        <span>User</span>
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <ProfileImage src={user.profileImage} size={40} />
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      );
    },
    size: 360,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.phone ?? '-',
    size: 140,
  },
  {
    accessorKey: 'createdAt',
    header: () => (
      <div className="flex items-center gap-2 bg-baground">
        <span>Joined</span>
      </div>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.createdAt}</span>
    ),
    size: 140,
  },
  {
    accessorKey: 'isBlocked',
    header: 'Status',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <StatusBadge
          label={user.isBlocked ? 'Blocked' : 'Active'}
          status={user.isBlocked ? 'error' : 'success'}
          onClick={() => openStatusModal(user)}
        />
      );
    },
    size: 120,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            iconLeft={<Eye className="w-4 h-4" />}
            onClick={() => openView(user._id)}
          >
            View
          </Button>

          {/* <Button size="icon" variant="ghost" onClick={() => console.log('open menu', user._id)}>
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </Button> */}
        </div>
      );
    },
    size: 140,
  },
];

export default userColumns;
