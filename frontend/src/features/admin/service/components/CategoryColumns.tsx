import { Eye, Pencil } from 'lucide-react';

import categoryImage from '@/assets/images/categoryImage.jpeg';
import Button from '@/components/atoms/Button';
import ProfileImage from '@/components/molecules/ProfileImage';
import type { Category } from '@/types/category';
import type { TableColumnDef } from '@/types/table.types';

const categoryColumns = (
  currentLevel: number,
  onToggleStatus: (category: Category) => void,
  onEdit: (category: Category) => void,
  onViewChild: (categoryId: string) => void
): TableColumnDef<Category>[] => {
  const baseColumns: TableColumnDef<Category>[] = [
    {
      id: 'index',
      header: '#',
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return (
          <span className="text-muted-foreground">{pageIndex * pageSize + row.index + 1}</span>
        );
      },
      hideOnSmall: true,
      minWidth: 20,
    },
    {
      id: 'category',
      header: 'Category',
      accessorKey: 'name',
      cell: ({ row }) => <div className="font-medium line-clamp-2">{row.original.name}</div>,
      showInMobileHeader: true,
      mobileOrder: 1,
      mobileLabel: '',
      minWidth: currentLevel === 3 ? 100 : 180,
    },
    {
      id: 'icon',
      header: 'Icon',
      accessorKey: 'iconUrl',
      cell: ({ row }) => (
        <ProfileImage src={row.original.iconUrl} size={40} fallbackImage={categoryImage} />
      ),
      hideOnSmall: true,
      showInMobileHeader: false,
      mobileOrder: 5,
      mobileLabel: 'Icon',
      minWidth: 30,
    },
    {
      id: 'image',
      header: 'Image',
      accessorKey: 'imageUrl',
      cell: ({ row }) => (
        <ProfileImage src={row.original.imageUrl} size={40} fallbackImage={categoryImage} />
      ),
      hideOnSmall: true,
      showInMobileHeader: false,
      mobileOrder: 4,
      mobileLabel: 'Image',
      minWidth: 50,
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2">
          {row.original.description || '-'}
        </span>
      ),
      hideOnSmall: true,
      showInMobileHeader: false,
      mobileOrder: 5,
      mobileLabel: 'description',
      maxWidth: 250,
    },
    {
      id: 'baseRate',
      header: 'BaseRate',
      accessorKey: 'baseRate',
      cell: ({ row }) => <span>{row.original.baseRate}</span>,
      hideOnSmall: true,
      showInMobileHeader: false,
      mobileOrder: 3,
      mobileLabel: 'BaseRate',
      width: 30,
    },

    {
      id: 'platformFee',
      header: 'PlatformFee',
      accessorKey: 'PlatformFee',
      cell: ({ row }) => <span>{row.original.platformFee}</span>,
      hideOnSmall: true,
      showInMobileHeader: false,
      mobileOrder: 4,
      mobileLabel: 'PlatformFee',
      minWidth: 30,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'isAvailable',
      cell: ({ row }) => (
        <Button
          className="cursor-pointer"
          size="sm"
          variant={row.original.isAvailable ? 'green' : 'red'}
          onClick={() => onToggleStatus(row.original)}
        >
          {row.original.isAvailable ? 'Available' : 'Blocked'}
        </Button>
      ),
      showInMobileHeader: true,
      mobileOrder: 7,
      mobileLabel: 'Status',
      width: 70,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.level !== 3 && (
            <Button size="sm" variant="blue" onClick={() => onViewChild(row.original.id)}>
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
        </div>
      ),
      showInMobileHeader: false,
      mobileOrder: 6,
      width: 180,
      minWidth: 180,
    },
  ];
  if (currentLevel === 3) {
    const actionCoums = baseColumns.pop();

    baseColumns.push(
      {
        id: 'serviceType',
        header: 'Service Type',
        accessorKey: 'serviceType',
        cell: ({ row }) => <span>{row.original.serviceType ?? '-'}</span>,
        hideOnSmall: true,
        mobileOrder: 10,
        mobileLabel: 'Service Type',
        minWidth: 120,
      },
      actionCoums!
    );
  }
  return baseColumns;
};

export default categoryColumns;
