import { StatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import type { TableColumnDef } from '@/types/table.types';
import { Eye, Pencil } from 'lucide-react';
import type { ServiceRow } from '@/types/admin/service';

const serviceColumns = (
  onToggleStatus: (service: ServiceRow) => void,
  onEdit: (service: ServiceRow) => void,
  onViewChild: (service: ServiceRow) => void
): TableColumnDef<ServiceRow>[] => [
  {
    id: 'index',
    header: '#',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <span className="text-muted-foreground">{pageIndex * pageSize + row.index + 1}</span>;
    },
    hideOnSmall: true,
    width: 30,
    minWidth: 30,
    maxWidth: 30,
  },
  {
    id: 'service',
    header: 'Service',
    accessorKey: 'name',
    cell: ({ row }) => <div className="font-medium line-clamp-2">{row.original.name}</div>,
    showInMobileHeader: true,
    mobileOrder: 1,
    mobileLabel: '',
    minWidth: 200,
    maxWidth: 250,
  },
  {
    id: 'icon',
    header: 'Icon',
    accessorKey: 'iconUrl',
    cell: ({ row }) => <ProfileImage src={row.original.iconUrl} size={40} />,
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 5,
    mobileLabel: 'Icon',
    width: 50,
  },
  {
    id: 'image',
    header: 'Image',
    accessorKey: 'imageUrl',
    cell: ({ row }) => <ProfileImage src={row.original.imageUrl} size={40} />,
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 4,
    mobileLabel: 'Image',
    width: 50,
  },
  {
    id: 'description',
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2">{row.original.description || '-'}</span>
    ),
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 5,
    mobileLabel: 'description',
    width: 350,
  },
  {
    id: 'platformFee',
    header: 'PlatformFee',
    accessorKey: 'PlatformFee',
    cell: ({ row }) => <span>{row.original.platformFee}</span>,
    hideOnSmall: true,
    showInMobileHeader: false,
    mobileOrder: 3,
    mobileLabel: 'PlatformFee',
    width: 60,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'isAvailable',
    cell: ({ row }) => (
      <StatusBadge
        label={row.original.isAvailable ? 'Active' : 'Blocked'}
        status={row.original.isAvailable ? 'success' : 'error'}
      />
    ),
    showInMobileHeader: true,
    mobileOrder: 7,
    mobileLabel: 'Status',
    width: 100,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.level !== 3 && (
          <Button size="sm" variant="blue" onClick={() => onViewChild(row.original)}>
            <Eye size={17} />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          iconLeft={<Pencil className="w-4 h-4" />}
          onClick={() => onEdit(row.original)}
        >
          Edit
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onToggleStatus(row.original)}>
          {row.original.isAvailable ? 'Block' : 'Unblock'}
        </Button>
      </div>
    ),
    showInMobileHeader: false,
    mobileOrder: 6,
    width: 270,
    minWidth: 200,
  },
];

export default serviceColumns;
