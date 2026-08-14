import { Eye } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import { Badge } from '@/components/ui/badge';
import { ROLE, type Role } from '@/constants';
import { DISPUTE_REASON_LABELS } from '@/constants/dispute';
import type { DisputeListItem } from '@/types/dispute';
import type { TableColumnDef } from '@/types/table.types';
import { formatDate } from '@/utils/time.format';

export const disputeColumns = (
  onDisputeDetails: (bookingId: string) => void,
  role: Role = ROLE.ADMIN,
  context?: { workerId?: string; userId?: string }
): TableColumnDef<DisputeListItem>[] => {
  const getProfileLink = (target: 'user' | 'worker', id: string, role: Role) => {
    if (role === ROLE.ADMIN) {
      return `/admin/${target}s/${id}`;
    }
    if (role === ROLE.USER && target === 'worker') {
      return `/workers/${id}`;
    }
    return null;
  };

  const columns: TableColumnDef<DisputeListItem>[] = [
    {
      id: 'id',
      header: 'Dispute ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <div>
          <div className="text-xs text-muted-foreground">#{row.original.disputeId}</div>
        </div>
      ),
      showInMobileHeader: true,
      mobileOrder: 1,
      mobileLabel: 'Dispute ID',
      minWidth: 140,
    },
    {
      id: 'user',
      header: 'User ',
      accessorKey: 'user.name',
      cell: ({ row }) => {
        const link = getProfileLink('user', row.original.user.id, role);
        return (
          <div className="flex items-center gap-2">
            <ProfileImage
              src={row.original.user.profileImage}
              size={32}
              name={row.original.user.name}
            />
            {link ? (
              <NavLink to={link} className="hover:underline font-medium text-sm">
                {row.original.user.name}
              </NavLink>
            ) : (
              <div className="font-medium text-sm">{row.original.user.name}</div>
            )}
          </div>
        );
      },
      showInMobileHeader: false,
      mobileOrder: 4,
      mobileLabel: 'User',
      minWidth: 150,
    },
    {
      id: 'worker',
      header: 'Worker',
      accessorKey: 'worker.name',
      cell: ({ row }) => {
        const link = getProfileLink('worker', row.original.worker.id, role);
        return (
          <div className="flex items-center gap-2">
            <ProfileImage
              src={row.original.worker.profileImage}
              size={32}
              name={row.original.worker.name}
            />
            {link ? (
              <NavLink to={link} className="hover:underline font-medium text-sm">
                {row.original.worker.name}
              </NavLink>
            ) : (
              <div className="font-medium text-sm">{row.original.worker.name}</div>
            )}
          </div>
        );
      },
      showInMobileHeader: false,
      mobileOrder: 5,
      mobileLabel: 'Worker',
      minWidth: 150,
    },
    {
      id: 'raisedBy',
      header: 'Raised By',
      accessorKey: 'raisedBy',
      cell: ({ row }) => {
        const raised = row.original.raisedBy;
        const isUser = raised === ROLE.USER;
        return <Badge variant={isUser ? 'blue' : 'amber'}>{raised.toUpperCase()}</Badge>;
      },
      showInMobileHeader: true,
      mobileOrder: 2,
      mobileLabel: 'Raised By',
      width: 100,
    },
    {
      id: 'reason',
      header: 'Reason',
      accessorKey: 'reason',
      cell: ({ row }) => {
        const reason = row.original.reason;
        return (
          <span className="text-zinc-600 text-sm font-medium">{DISPUTE_REASON_LABELS[reason]}</span>
        );
      },
      showInMobileHeader: false,
      mobileOrder: 6,
      mobileLabel: 'Reason',
      minWidth: 150,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusType: 'green' | 'amber' | 'red' | 'blue' | 'slate' = 'slate';

        switch (status) {
          case 'resolved':
            statusType = 'green';
            break;
          case 'pending':
            statusType = 'amber';
            break;
          case 'under_review':
            statusType = 'blue';
            break;
          case 'dismissed':
            statusType = 'red';
            break;
        }

        const label = status.charAt(0).toUpperCase() + status.replaceAll('_', ' ').slice(1);
        return <Badge variant={statusType}>{label}</Badge>;
      },
      showInMobileHeader: true,
      mobileOrder: 8,
      mobileLabel: 'Status',
      width: 120,
    },
    {
      id: 'createdAt',
      header: 'Raised At',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.original.createdAt, 'calendar')}
          </span>
        );
      },
      showInMobileHeader: true,
      mobileOrder: 3,
      mobileLabel: 'Raised At',
      width: 140,
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
            onClick={() => onDisputeDetails(row.original.bookingId)}
          >
            View
          </Button>
        </div>
      ),
      showInMobileHeader: false,
      mobileOrder: 7,
      mobileLabel: 'Actions',
      width: 100,
    },
  ];

  return columns.filter(col => {
    if (role === ROLE.USER && col.id === 'user') {
      return false;
    }
    if (role === ROLE.WORKER && col.id === 'worker') {
      return false;
    }
    if (context?.workerId && col.id === 'worker') {
      return false;
    }
    if (context?.userId && col.id === 'user') {
      return false;
    }

    return true;
  });
};
