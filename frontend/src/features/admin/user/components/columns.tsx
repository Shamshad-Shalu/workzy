import dayjs from 'dayjs';
import { Eye } from 'lucide-react';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import type { UserRow } from '@/types/admin/user';
import type { TableColumnDef } from '@/types/table.types';

const userColumns = (
  onToggleStatus: (user: UserRow) => void,
  onView: (id: string) => void
): TableColumnDef<UserRow>[] => [
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <span className="text-muted-foreground">{pageIndex * pageSize + row.index + 1}</span>;
    },
    hideOnSmall: true,
    width: 40,
    minWidth: 30,
    maxWidth: 80,
  },
  {
    id: 'user',
    header: 'User',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ProfileImage src={row.original.profileImage} size={40} />
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      </div>
    ),
    showInMobileHeader: true,
    mobileOrder: 1,
    mobileLabel: '',
    minWidth: 200,
    maxWidth: 250,
  },
  {
    id: 'phone',
    header: 'Phone',
    accessorKey: 'phone',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone || '-'}</span>,
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 3,
    mobileLabel: 'Phone',
    width: 150,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'isBlocked',
    cell: ({ row }) => (
      <Badge variant={row.original.isBlocked ? 'red' : 'green'}>
        {row.original.isBlocked ? 'Blocked' : 'Active'}
      </Badge>
    ),
    showInMobileHeader: true,
    mobileOrder: 2,
    mobileLabel: 'Status',
    width: 120,
  },
  {
    id: 'joinedDate',
    header: 'Joined',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return <span className="text-muted-foreground">{dayjs(date).format('YYYY-MM-DD')}</span>;
    },
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 5,
    mobileLabel: 'Joined Date',
    width: 170,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          iconLeft={<Eye className="w-4 h-4" />}
          onClick={() => onView(row.original.id)}
        >
          View
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onToggleStatus(row.original)}>
          {row.original.isBlocked ? 'Unblock' : 'Block'}
        </Button>
      </div>
    ),
    showInMobileHeader: false,
    mobileOrder: 6,
    width: 200,
    minWidth: 180,
  },
];

export default userColumns;
