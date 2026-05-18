import dayjs from 'dayjs';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import {
  BILL_TYPE,
  PAYMENT_BILL_TYPE_CONFIG,
  PAYMENT_STATUS_CONFIG,
  type BadgeVariant,
} from '@/constants/payment';
import type { PaymentAdmin } from '@/types/payment';
import type { TableColumnDef } from '@/types/table.types';

const paymentColumns = (): TableColumnDef<PaymentAdmin>[] => [
  {
    id: 'transactionId',
    header: 'Transaction',
    accessorKey: 'transactionId',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          {payment.billType === BILL_TYPE.BOOKING ? (
            <span className="font-mono text-xs font-semibold text-primary truncate max-w-[160px]">
              {payment.transactionId}
            </span>
          ) : (
            <span className="font-mono text-xs font-semibold text-muted-foreground truncate max-w-[160px]">
              {payment.transactionId}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {dayjs(payment.createdAt).format('MMM D, YYYY · h:mm A')}
          </span>
        </div>
      );
    },
    showInMobileHeader: true,
    mobileOrder: 1,
    mobileLabel: 'Transaction',
    minWidth: 160,
  },
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.title}</span>,
    minWidth: 120,
  },
  {
    id: 'user',
    header: 'User',
    accessorKey: 'user.name',
    cell: ({ row }) => (
      <Link
        to={`/admin/users/${row.original.user.id}`}
        className="text-foreground font-medium hover:text-primary hover:underline underline-offset-2 transition-colors text-sm"
      >
        {row.original.user.name}
      </Link>
    ),
    minWidth: 120,
  },
  {
    id: 'worker',
    header: 'Worker',
    accessorKey: 'worker.name',
    cell: ({ row }) => (
      <Link
        to={`/admin/workers/${row.original.worker.id}`}
        className="text-foreground font-medium hover:text-primary hover:underline underline-offset-2 transition-colors text-sm"
      >
        {row.original.worker.name}
      </Link>
    ),
    minWidth: 120,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            ₹{payment.amount.toLocaleString('en-IN')}
          </span>
          {payment.platformFee !== null && payment.platformFee !== undefined && (
            <span className="text-[11px] text-muted-foreground">Fee: ₹{payment.platformFee}</span>
          )}
        </div>
      );
    },
    minWidth: 100,
  },
  {
    id: 'billType',
    header: 'Type',
    accessorKey: 'billType',
    cell: ({ row }) => {
      const billCfg = PAYMENT_BILL_TYPE_CONFIG[row.original.billType] ?? {
        label: row.original.billType,
        variant: 'secondary' as BadgeVariant,
      };
      return <Badge variant={billCfg.variant}>{billCfg.label}</Badge>;
    },
    width: 100,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const statusCfg = PAYMENT_STATUS_CONFIG[row.original.status] ?? {
        label: row.original.status,
        variant: 'secondary' as BadgeVariant,
      };
      return <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>;
    },
    width: 100,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex justify-end">
          {payment.billType === BILL_TYPE.BOOKING && (
            <Link
              to={`/admin/bookings/${payment.refId}`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-all duration-150 group-hover:opacity-100 opacity-60"
              title="View booking"
            >
              <Eye className="w-4 h-4" />
            </Link>
          )}
        </div>
      );
    },
    width: 50,
  },
];

export default paymentColumns;
