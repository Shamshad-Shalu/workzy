import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';

type ReviewFilterParams = {
  sortBy: 'createdAt' | 'rating';
  sortOrder: 'asc' | 'desc';
  rating: number | null;
};

const REVIEW_FILTER_PARAMS = [
  { key: 'sortBy', defaultValue: 'createdAt' },
  { key: 'sortOrder', defaultValue: 'desc' },
  { key: 'rating', parser: (v: string) => (v ? Number(v) : null) },
];

export function useReviewFilterParams() {
  const { sortBy, sortOrder, rating, updateParams } =
    useUrlFilterParams<ReviewFilterParams>(REVIEW_FILTER_PARAMS);

  const clearFilters = () => {
    updateParams({ sortBy: 'createdAt', sortOrder: 'desc', rating: null });
  };

  const isFiltersActive = sortBy !== 'createdAt' || sortOrder !== 'desc' || rating !== null;

  return {
    sortBy,
    sortOrder,
    rating,
    updateParams,
    clearFilters,
    isFiltersActive,
  };
}
