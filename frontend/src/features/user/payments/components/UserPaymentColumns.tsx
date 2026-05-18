import dayjs from 'dayjs';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { BILL_TYPE, PAYMENT_STATUS_CONFIG, type BadgeVariant } from '@/constants/payment';
import type { PaymentUser } from '@/types/payment';
import type { TableColumnDef } from '@/types/table.types';
import { formatCurrency } from '@/utils/currency';

const UserPaymentColumns = (): TableColumnDef<PaymentUser>[] => [
  {
    id: 'transactionId',
    header: 'Transaction',
    accessorKey: 'transactionId',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          {payment.billType === BILL_TYPE.BOOKING ? (
            <Link
              to={`/bookings/${payment.refId}`}
              className="font-mono text-xs font-semibold text-primary hover:underline underline-offset-2 truncate max-w-[160px]"
              title={payment.refId}
            >
              {payment.transactionId}
            </Link>
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
    cell: ({ row }) => {
      const { billType, title } = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{billType.toUpperCase()}</span>
        </div>
      );
    },
    minWidth: 120,
  },
  {
    id: 'worker',
    header: 'Worker',
    accessorKey: 'worker.name',
    cell: ({ row }) => (
      <Link
        to={`/workers/${row.original.workerId}`}
        className="text-foreground font-medium hover:text-primary hover:underline underline-offset-2 transition-colors text-sm"
      >
        {row.original.workerName}
      </Link>
    ),
    minWidth: 120,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            {formatCurrency(row.original.amount)}
          </span>
        </div>
      );
    },
    minWidth: 100,
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
              to={`/bookings/${payment.refId}`}
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

export default UserPaymentColumns;
