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
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { TableColumnDef, PaginationAdapter, RowWithAnyId } from '@/types/table.types';

type DataListMode = 'table' | 'card';

type DataListPaginationProps =
  | {
      paginationType?: 'offset';
      total: number;
      pageIndex: number;
      pageSize: number;
      pageCount: number;
      onPageChange: (p: number) => void;
      onPageSizeChange: (s: number) => void;
      hasNextPage?: never;
      fetchNextPage?: never;
      isFetchingNextPage?: never;
    }
  | {
      paginationType: 'cursor';
      hasNextPage: boolean;
      fetchNextPage: () => void;
      isFetchingNextPage?: boolean;
      total?: never;
      pageIndex?: never;
      pageSize?: never;
      pageCount?: never;
      onPageChange?: never;
      onPageSizeChange?: never;
    };

type DataListProps<T extends RowWithAnyId> = {
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  mode: DataListMode;
  columns?: TableColumnDef<T>[];
  renderCard?: (item: T) => ReactNode;
  gridClassName?: string;

  emptyState?: ReactNode;
  errorState?: ReactNode;
} & DataListPaginationProps;

export function DataList<T extends RowWithAnyId>({
  data,
  isLoading = false,
  isError,
  mode,
  columns = [],
  renderCard,
  gridClassName = 'grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  emptyState,
  errorState,
  paginationType = 'offset',
  total,
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
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

  const sentinelRef = useInfiniteScroll(
    paginationType === 'cursor' && fetchNextPage ? fetchNextPage : () => {},
    paginationType === 'cursor' ? !!hasNextPage : false,
    paginationType === 'cursor' ? !!isFetchingNextPage : false
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(paginationType === 'offset'
        ? { pagination: { pageIndex: pageIndex!, pageSize: pageSize! } }
        : {}),
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: paginationType === 'offset',
    ...(paginationType === 'offset' ? { pageCount } : {}),
    meta: {
      total: paginationType === 'offset' ? total : data.length,
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

  const paginationAdapter: PaginationAdapter | null =
    paginationType === 'offset'
      ? {
          getState: () => ({
            pagination: { pageIndex: pageIndex!, pageSize: pageSize! },
          }),
          getCanPreviousPage: () => pageIndex! > 0,
          getCanNextPage: () => pageIndex! < pageCount! - 1,
          getPageCount: () => pageCount!,
          setPageSize: (size: number) => onPageSizeChange!(size),
          options: {
            meta: { total },
          },
        }
      : null;

  const renderPagination = () => {
    if (paginationType === 'offset') {
      const tableAdapter = mode === 'card' ? paginationAdapter! : table;
      return (
        <DataTablePagination
          table={tableAdapter}
          onPageChange={onPageChange!}
          onPageSizeChange={onPageSizeChange!}
        />
      );
    }

    if (hasNextPage || data.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
        <div className="text-md text-muted-foreground">
          Showing <b>{data.length}</b> results
        </div>
        <div className="text-sm text-muted-foreground italic">All records loaded</div>
      </div>
    );
  };

  if (mode === 'card') {
    return (
      <div className="space-y-6">
        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: 4 }).map((_, i) => (
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
            {paginationType === 'cursor' &&
              isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <DataTableSkeletonRow key={`skeleton-${i}`} isSmallScreen rowCount={1} />
              ))}
          </div>
        )}

        {(!hasNextPage || paginationType === 'offset') && (
          <div className="bg-card rounded-lg px-4">{renderPagination()}</div>
        )}
        {paginationType === 'cursor' && <div ref={sentinelRef} className="h-4" />}
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
            {paginationType === 'cursor' &&
              isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <DataTableSkeletonRow key={`skeleton-${i}`} isSmallScreen rowCount={1} />
              ))}
          </div>
        )}

        {(!hasNextPage || paginationType === 'offset') && (
          <div className="bg-card rounded-lg px-4 @container">{renderPagination()}</div>
        )}
        {paginationType === 'cursor' && <div ref={sentinelRef} className="h-4" />}
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
              <DataTableSkeletonRow isSmallScreen={false} rowCount={5} />
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
              <>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-t hover:bg-secondary/50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {paginationType === 'cursor' && isFetchingNextPage && (
                  <DataTableSkeletonRow isSmallScreen={false} rowCount={4} />
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {(!hasNextPage || paginationType === 'offset') && (
        <div className="bg-card rounded-lg px-4 @container">{renderPagination()}</div>
      )}
      {paginationType === 'cursor' && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
