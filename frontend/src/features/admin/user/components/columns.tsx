import { StatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import type { UserRow } from '@/types/admin/user';
import type { TableColumnDef } from '@/types/table.types';
import { Eye } from 'lucide-react';
import dayjs from 'dayjs';

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
    width: '40px',
    minWidth: '30px',
    maxWidth: '80px',
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
    minWidth: '200px',
    maxWidth: '250px',
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
    width: '150px',
  },
  {
    id: 'premium',
    header: 'Premium',
    accessorKey: 'isPremium',
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.isPremium ? 'Premium' : 'Free'}
        status={row.original.isPremium ? 'info' : 'neutral'}
      />
    ),
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 4,
    mobileLabel: 'Account Type',
    width: '120px',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'isBlocked',
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.isBlocked ? 'Blocked' : 'Active'}
        status={row.original.isBlocked ? 'error' : 'success'}
      />
    ),
    showInMobileHeader: true,
    mobileOrder: 2,
    mobileLabel: 'Status',
    width: '120px',
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
    width: '170px',
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
          onClick={() => onView(row.original._id)}
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
    width: '200px',
    minWidth: '180px',
  },
];

export default userColumns;
