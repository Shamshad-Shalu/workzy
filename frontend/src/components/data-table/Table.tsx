import type { UserRow } from '@/types/admin/user';
import {
  useReactTable,
  type ColumnDef,
  type SortingState,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import DataTableMobileCard from './DataTableMobileCard';
import { DataTablePagination } from './DataTablePagination';

interface TableProps {
  columns: ColumnDef<UserRow>[];
  data: UserRow[];
  pageIndex: number;
  total: number | undefined;
  pageSize: number;
  pageCount?: number | undefined;
  manual?: {
    serverSidePagination?: boolean;
    serverSideSorting?: boolean;
    serverSideFiltering?: boolean;
  };
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (next: SortingState) => void;
}

export default function Table({
  columns,
  data,
  pageIndex,
  pageSize,
  total = 0,
  pageCount = 1,
  manual,
//   isLoading = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: TableProps) {
  console.log({
    columns,
    data,
    pageIndex,
    pageSize,
    pageCount,
    manual,
  });

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater: any) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortChange?.(next);
    },
    pageCount,
    manualPagination: !!manual?.serverSidePagination,
    manualSorting: !!manual?.serverSideSorting,
    manualFiltering: !!manual?.serverSideFiltering,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      total,
    },
  });

  if (isMobile) {
    return (
      <div>
        {' '}
        {data.map((d, i) => (
          <DataTableMobileCard
            key={d._id}
            item={d}
            index={i}
            onView={id => console.log('view,', id)}
            onToggleStatus={id => console.log('toggle:', id)}
          />
        ))}
        <div className="bg-card rounded-lg px-4 mt-6">
          {' '}
          <DataTablePagination
            table={table}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />{' '}
        </div>{' '}
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden space-y-6">
      {' '}
      <div className="rounded-xl border bg-card ">
        {' '}
        <table className="min-w-full table-auto">
          {' '}
          <thead className="bg-secondary text-md">
            {' '}
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                                             
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-6 py-3">
                    {' '}
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}{' '}
                  </th>
                ))}{' '}
              </tr>
            ))}{' '}
          </thead>{' '}
          <tbody>
            {' '}
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t">
                {' '}
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 align-top">
                    {' '}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}               {' '}
                  </td>
                ))}{' '}
              </tr>
            ))}{' '}
            {data.length === 0 && (
              <tr>
                {' '}
                <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                                  No results                            {' '}
                </td>{' '}
              </tr>
            )}{' '}
          </tbody>{' '}
        </table>{' '}
      </div>{' '}
      <div className="bg-card rounded-lg px-4">
        {' '}
        <DataTablePagination
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />{' '}
      </div>{' '}
    </div>
  );
}
