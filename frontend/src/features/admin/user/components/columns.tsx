import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import type { UserListItem } from '@/types/admin/user';
import type { TableColumnDef } from '@/types/table.types';
import { formatDate } from '@/utils/time.format';

const userColumns = (
  onToggleStatus: (user: UserListItem) => void
): TableColumnDef<UserListItem>[] => [
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
        <ProfileImage src={row.original.profileImage} size={40} name={row.original.name} />
        <div>
          <div className="flex items-center gap-2 font-medium">
            {row.original.name}
            {row.original.role === 'worker' && (
              <Badge className="text-xs px-2 py-0.5">Worker</Badge>
            )}
          </div>

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
      return <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>;
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
        <Link to={row.original.id}>
          <Button size="sm" variant="outline" iconLeft={<Eye className="w-4 h-4" />}>
            View
          </Button>
        </Link>
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
