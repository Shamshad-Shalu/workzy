import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import type { WorkerListItem } from '@/types/admin/worker';
import type { TableColumnDef } from '@/types/table.types';
import { formatDate } from '@/utils/time.format';

const workerColumns = () // onToggleStatus: (worker: WorkerListItem) => void,
: TableColumnDef<WorkerListItem>[] => [
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
        <ProfileImage src={row.original.profileImage} size={40} name={row.original.displayName} />
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
  {
    id: 'status',
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
        case 'suspended':
          statusType = 'red';
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
    id: 'stripStatus',
    header: 'stripStatus',
    accessorKey: 'stripStatus',
    cell: ({ row }) => {
      const stripSstatus = row.original.stripeAccountStatus;
      return (
        <Badge
          variant={
            stripSstatus === 'active' ? 'green' : stripSstatus === 'pending' ? 'blue' : 'amber'
          }
        >
          {stripSstatus}
        </Badge>
      );
    },
    showInMobileHeader: true,
    mobileOrder: 2,
    mobileLabel: 'Worker Status',
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
    mobileOrder: 6,
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
      </div>
    ),
    showInMobileHeader: false,
    mobileOrder: 7,
    width: 180,
    minWidth: 180,
  },
];

export default workerColumns;
