import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import React, { useEffect, useState, type ReactNode } from 'react';

import DataTableMobileCard from '@/components/data-table/DataTableMobileCard';
import { DataTablePagination } from '@/components/data-table/DataTablePagination';
import { DataTableSkeletonRow } from '@/components/data-table/TableSkeletonRow';
import type { TableColumnDef, PaginationAdapter, RowWithAnyId } from '@/types/table.types';

type DataListMode = 'table' | 'card';

interface DataListProps<T extends RowWithAnyId> {
  data: T[];
  total: number;

  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  isLoading?: boolean;
  isError?: boolean;
  mode: DataListMode;
  columns?: TableColumnDef<T>[];
  renderCard?: (item: T) => ReactNode;
  gridClassName?: string;

  emptyState?: ReactNode;
  errorState?: ReactNode;
}

export function DataList<T extends RowWithAnyId>({
  data,
  total,
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isError,
  mode,
  columns = [],
  renderCard,
  gridClassName = 'grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  emptyState,
  errorState,
}: DataListProps<T>) {
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const resize = () => setIsSmallScreen(window.innerWidth < 1024);
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
    meta: {
      total,
    },
  });
  const renderState = () => {
    if (isLoading) {
      return null;
    }
    if (isError) {
      return (
        errorState ?? (
          <div className="bg-card border rounded-xl p-8 text-center text-destructive">
            Something went wrong
          </div>
        )
      );
    }
    if (data.length === 0) {
      return (
        emptyState ?? (
          <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
            No results found
          </div>
        )
      );
    }

    return null;
  };

  const uiState = renderState();

  if (mode === 'card') {
    const paginationAdapter: PaginationAdapter = {
      getState: () => ({
        pagination: { pageIndex, pageSize },
      }),
      getCanPreviousPage: () => pageIndex > 0,
      getCanNextPage: () => pageIndex < pageCount - 1,
      getPageCount: () => pageCount,
      setPageSize: (size: number) => onPageSizeChange(size),
      options: {
        meta: { total },
      },
    };

    return (
      <div className="space-y-6">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: pageSize }).map((_, i) => (
              <DataTableSkeletonRow key={i} isSmallScreen rowCount={1} />
            ))}
          </div>
        ) : uiState ? (
          uiState
        ) : (
          <div className={gridClassName}>
            {data.map(item => (
              <React.Fragment key={'id' in item ? item.id : item._id}>
                {renderCard?.(item)}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="bg-card rounded-lg px-4">
          <DataTablePagination
            table={paginationAdapter}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <DataTableSkeletonRow key={i} isSmallScreen rowCount={1} />
            ))}
          </div>
        ) : uiState ? (
          uiState
        ) : (
          <div className="space-y-4">
            {data.map(item => (
              <DataTableMobileCard<T>
                key={'id' in item ? item.id : item._id}
                item={item}
                columns={columns}
              />
            ))}
          </div>
        )}

        <div className="bg-card rounded-lg px-4 @container">
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
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-6 py-3">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <DataTableSkeletonRow isSmallScreen={false} rowCount={pageSize} />
            ) : isError ? (
              <tr>
                <td colSpan={100}>
                  {errorState ?? (
                    <div className="py-8 text-center text-destructive">Something went wrong</div>
                  )}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={100}>
                  {emptyState ?? (
                    <div className="py-8 text-center text-muted-foreground">No results found</div>
                  )}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-t hover:bg-secondary/50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-card rounded-lg px-4 @container">
        <DataTablePagination
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
