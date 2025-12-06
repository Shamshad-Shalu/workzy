import { useState, useEffect } from 'react';
import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from '../atoms/Button';

interface Props<T> {
  table: Table<T>;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<T>({ table, onPageChange, onPageSizeChange }: Props<T>) {
  const [pageSizeLocal, setPageSizeLocal] = useState(table.getState().pagination.pageSize);

  useEffect(() => {
    setPageSizeLocal(table.getState().pagination.pageSize);
  }, [table.getState().pagination.pageSize]);

  const handlePageSizeChange = (v: number) => {
    table.setPageSize(v);
    onPageSizeChange?.(v);
  };

  const { pageIndex, pageSize } = table.getState().pagination;

  const totalFilteredRows = (table.options.meta as any)?.total ?? 0;
  const startIndex = totalFilteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endIndex = Math.min((pageIndex + 1) * pageSize, totalFilteredRows);

  return (
    <div className="flex items-center justify-between px-2 py-4 ">
      <div className="text-md text-muted-foreground">
        Showing <b>{startIndex}</b>
        {' to '}
        <b>{endIndex}</b>
        {' of '}
        <b>{totalFilteredRows}</b>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm">Rows:</span>
          <select
            className="input"
            value={pageSizeLocal}
            onChange={e => handlePageSizeChange?.(Number(e.target.value))}
          >
            {[5, 10, 20].map(s => (
              <option key={s} value={s} className="bg-card border">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden lg:inline-flex"
            onClick={() => {
              onPageChange?.(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onPageChange?.(pageIndex - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <div className="px-3 text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>
          <Button
            variant="outline"
            onClick={() => {
              onPageChange?.(pageIndex + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden lg:inline-flex"
            onClick={() => {
              onPageChange?.(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
