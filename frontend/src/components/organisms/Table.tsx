import React from 'react';
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/atoms/Button';

export interface Column<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T, index: number) => void;
  rowClassName?: (row: T, index: number) => string;
  emptyMessage?: string;
  compact?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      isLoading,
      error,
      pagination,
      onRowClick,
      rowClassName,
      emptyMessage = 'No data found',
      compact = false,
    }: TableProps,
    ref
  ) => {
    const getNestedValue = (obj: any, path: string): any => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };

    return (
      <div className="w-full space-y-4">
        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <ShadTable ref={ref}>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map(column => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      'text-foreground font-semibold',
                      compact ? 'px-3 py-2 text-xs' : 'px-6 py-4',
                      column.headerClassName
                    )}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <span className="text-muted-foreground cursor-pointer">↕</span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => onRowClick?.(row, rowIndex)}
                    className={cn(
                      'hover:bg-muted/30 transition-colors',
                      onRowClick && 'cursor-pointer',
                      rowClassName?.(row, rowIndex)
                    )}
                  >
                    {columns.map(column => {
                      const value = getNestedValue(row, String(column.key));
                      const rendered = column.render?.(value, row, rowIndex) ?? value;

                      return (
                        <TableCell
                          key={String(column.key)}
                          className={cn(
                            'text-foreground',
                            compact ? 'px-3 py-2 text-sm' : 'px-6 py-4',
                            column.className
                          )}
                          style={{ width: column.width }}
                        >
                          {rendered}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </ShadTable>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              {data.length === 0 ? 0 : (pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
              to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}{' '}
              of {pagination.totalItems} items
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1}
                className="py-2 px-3 text-xs"
                iconLeft={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map(
                  page => (
                    <button
                      key={page}
                      onClick={() => pagination.onPageChange(page)}
                      className={`w-8 h-8 rounded-lg font-medium text-xs transition-colors ${
                        pagination.currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-muted-foreground">...</span>
                    <button
                      onClick={() => pagination.onPageChange(pagination.totalPages)}
                      className="w-8 h-8 rounded-lg font-medium text-xs hover:bg-muted text-foreground transition-colors"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  pagination.onPageChange(
                    Math.min(pagination.totalPages, pagination.currentPage + 1)
                  )
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="py-2 px-3 text-xs"
                iconRight={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = 'Table';

export default Table;
