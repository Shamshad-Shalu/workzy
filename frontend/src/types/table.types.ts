import { type ColumnDef } from '@tanstack/react-table';

export interface TableColumnMeta {
  hideOnSmall?: boolean;
  mobileOrder?: number;
  mobileLabel?: string;
  showInMobileHeader?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export type TableColumnDef<T> = ColumnDef<T, unknown> & TableColumnMeta;

export interface PaginationAdapter {
  getState: () => {
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
  };
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  getPageCount: () => number;
  setPageSize: (size: number) => void;
  options: {
    meta?: {
      total?: number;
    };
  };
}

export type RowWithAnyId = { id: string } | { _id: string };
