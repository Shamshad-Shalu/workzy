import { type ColumnDef } from '@tanstack/react-table';

export interface TableColumnMeta {
  hideOnSmall?: boolean;
  mobileOrder?: number;
  mobileLabel?: string;
  showInMobileHeader?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}

export type TableColumnDef<T> = ColumnDef<T, any> & TableColumnMeta;
