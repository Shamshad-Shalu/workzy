import type { TableColumnDef } from '@/types/table.types';
import {
  useReactTable,
  type SortingState,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { DataTablePagination } from './DataTablePagination';
import DataTableMobileCard from './DataTableMobileCard';
import { DataTableSkeletonRow } from './TableSkeletonRow';

interface TableProps<TData> {
  columns: TableColumnDef<TData>[];
  data: TData[];
  pageIndex: number;
  total?: number;
  pageSize: number;
  pageCount?: number;
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

export default function Table<TData extends { _id: string }>({
  columns,
  data,
  pageIndex,
  pageSize,
  total = 0,
  pageCount = 1,
  manual,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: TableProps<TData>) {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleColumns = columns.filter(col => {
    if (isSmallScreen && col.hideOnSmall) {
      return false;
    }
    return true;
  });

  const table = useReactTable({
    data,
    columns: visibleColumns,
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

  const getColumnWidth = (column: TableColumnDef<TData>) => {
    const styles: React.CSSProperties = {};

    if (column.width) {
      styles.width = `${column.width}px`;
    }
    if (column.minWidth) {
      styles.minWidth = `${column.minWidth}px`;
    }
    if (column.maxWidth) {
      styles.maxWidth = `${column.maxWidth}px`;
    }

    return styles;
  };

  if (isSmallScreen) {
    return (
      <div>
        {isLoading ? (
          <DataTableSkeletonRow isSmallScreen={true} />
        ) : data.length === 0 ? (
          <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
            No results found
          </div>
        ) : (
          data.map((item, i) => (
            <DataTableMobileCard key={item._id} item={item} columns={columns} index={i} />
          ))
        )}

        <div className="bg-card rounded-lg px-4 mt-6">
          <DataTablePagination
            table={table}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden space-y-6">
      <div className="rounded-xl border bg-card overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-secondary text-md">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => {
                  const colDef = columns.find(c => c.id === h.column.id);
                  return (
                    <th
                      key={h.id}
                      className="text-left px-6 py-3"
                      style={colDef ? getColumnWidth(colDef) : undefined}
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <DataTableSkeletonRow isSmallScreen={false} rowCount={pageSize} />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t hover:bg-secondary/50 transition-colors">
                  {row.getVisibleCells().map(cell => {
                    const colDef = columns.find(c => c.id === cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className="px-6 py-4 align-top"
                        style={colDef ? getColumnWidth(colDef) : undefined}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-card rounded-lg px-4">
        <DataTablePagination
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
