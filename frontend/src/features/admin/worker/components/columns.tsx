import dayjs from 'dayjs';
import { Eye } from 'lucide-react';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import type { WorkerRow } from '@/types/admin/worker';
import type { TableColumnDef } from '@/types/table.types';

const workerColumns = (
  onToggleStatus: (worker: WorkerRow) => void,
  onView: (id: string) => void,
  onToggleVerication: (worker: WorkerRow) => void
): TableColumnDef<WorkerRow>[] => [
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <span className="text-muted-foreground">{pageIndex * pageSize + row.index + 1}</span>;
    },
    hideOnSmall: true,
    width: 20,
    minWidth: 20,
    maxWidth: 30,
  },
  {
    id: 'worker',
    header: 'Worker',
    accessorKey: 'displayName',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ProfileImage src={row.original.profileImage} size={40} />
        <div>
          <div className="font-medium">{row.original.displayName}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      </div>
    ),
    showInMobileHeader: true,
    mobileOrder: 1,
    mobileLabel: '',
    minWidth: 200,
    maxWidth: 300,
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
  // {
  //   id: 'premium',
  //   header: 'Premium',
  //   accessorKey: 'isPremium',
  //   cell: ({ row }) => (
  //     <Badge  variant={row.original.isPremium ? 'amber' : 'blue'}>
  //       {row.original.isPremium ? 'Premium' : 'Free'}
  //     </Badge>
  //   ),
  //   hideOnSmall: true,
  //   showInMobileHeader: false,
  //   mobileOrder: 4,
  //   mobileLabel: 'Account Type',
  //   width: 100,
  // },
  {
    id: 'workerStatus',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusLabel = status;
      let statusType: 'green' | 'amber' | 'red' | 'blue' | 'slate' = 'slate';

      switch (status) {
        case 'verified':
          statusType = 'green';
          break;
        case 'pending':
          statusType = 'amber';
          break;
        case 'rejected':
          statusType = 'red';
          break;
        case 'needs_revision':
          statusType = 'blue';
          break;
      }

      return <Badge variant={statusType}>{statusLabel || ''}</Badge>;
    },
    showInMobileHeader: true,
    mobileOrder: 2,
    mobileLabel: 'Worker Status',
    width: 120,
  },
  {
    id: 'userStatus',
    header: 'W.Status',
    accessorKey: 'isBlocked',
    cell: ({ row }) => (
      <Badge variant={row.original.isBlocked ? 'red' : 'green'}>
        {row.original.isBlocked ? 'Blocked' : 'Active'}
      </Badge>
    ),
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 5,
    mobileLabel: 'Block/Unblock',
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
    mobileOrder: 6,
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
        <Button
          size="sm"
          variant={row.original.isBlocked ? 'green' : 'red'}
          onClick={() => onToggleStatus(row.original)}
        >
          {row.original.isBlocked ? 'Unblock' : 'Block'}
        </Button>
        {row.original.status === 'pending' && (
          <Button size="sm" variant="blue" onClick={() => onToggleVerication(row.original)}>
            <Eye size={18} />
          </Button>
        )}
      </div>
    ),
    showInMobileHeader: false,
    mobileOrder: 7,
    width: 180,
    minWidth: 180,
  },
];

export default workerColumns;
