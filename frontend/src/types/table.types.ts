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

export type TableColumnDef<T> = ColumnDef<T, any> & TableColumnMeta;
