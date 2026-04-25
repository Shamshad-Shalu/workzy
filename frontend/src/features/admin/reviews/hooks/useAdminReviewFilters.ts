import dayjs from 'dayjs';
import { useCallback } from 'react';

import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

export type AdminFilterState = {
  sortBy: 'createdAt' | 'rating';
  sortOrder: 'asc' | 'desc';
  rating: number | null;
  minRating: number | null;
  maxRating: number | null;
  fromDate: Date | null;
  toDate: Date | null;
};

const CUSTOM_PARAMS = [
  { key: 'sortBy', defaultValue: 'createdAt' },
  { key: 'sortOrder', defaultValue: 'desc' },
  { key: 'rating', parser: (v: string) => (v ? Number(v) : null) },
  { key: 'minRating', parser: (v: string) => (v ? Number(v) : null) },
  { key: 'maxRating', parser: (v: string) => (v ? Number(v) : null) },
  { key: 'fromDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
  { key: 'toDate', parser: (v: string) => (v ? dayjs(v).toDate() : null) },
];

export function useAdminReviewFilters() {
  const {
    updateParams,
    sortBy,
    sortOrder,
    rating,
    minRating,
    maxRating,
    fromDate,
    toDate,
    search,
    status,
  } = useUrlFilterParams<AdminFilterState>(CUSTOM_PARAMS);

  const hasActiveFilters =
    [rating, minRating, maxRating, fromDate, toDate].some(v => v !== null) ||
    Boolean(search) ||
    status !== 'all' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  const activeFilterCount =
    [rating, minRating, maxRating, fromDate, toDate].filter(v => v !== null).length +
    (search ? 1 : 0) +
    (status !== 'all' ? 1 : 0);

  const resetFilters = useCallback(() => {
    updateParams({
      search: '',
      rating: null,
      minRating: null,
      maxRating: null,
      fromDate: null,
      toDate: null,
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [updateParams]);

  return {
    updateParams,
    sortBy,
    sortOrder,
    rating,
    minRating,
    maxRating,
    fromDate,
    toDate,
    search,
    status,
    hasActiveFilters,
    activeFilterCount,
    resetFilters,
  };
}
