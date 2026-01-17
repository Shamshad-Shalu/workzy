import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Updates = Record<string, string | number | null | undefined>;

interface CategoryUrlParams {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  parentId: string | null;
  updateParams: (updates: Updates) => void;
}

export function useCategoryUrlParams(): CategoryUrlParams {
  const location = useLocation();
  const navigate = useNavigate();

  const filters = useUrlFilterParams<{ parentId: string | null }>([{ key: 'parentId' }]);

  const { pageIndex, pageSize, search, status, parentId } = filters;

  const updateParams = useCallback(
    (updates: Updates) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(currentParams);

      const filterKeys = Object.keys(updates).filter(
        key => !['page', 'pageIndex', 'pageSize'].includes(key)
      );

      Object.entries(updates).forEach(([key, value]) => {
        let paramKey = key === 'pageSize' ? 'limit' : key;

        if (value === null || value === undefined || value === '') {
          newParams.delete(paramKey);
          return;
        }

        let setValue = String(value);
        if (key === 'page' || key === 'pageIndex') {
          setValue = String(Number(value) + 1);
          paramKey = 'page';
        }

        newParams.set(paramKey, setValue);
      });
      const isPageUpdatedManually = updates.page !== undefined || updates.pageIndex !== undefined;

      const shouldResetPage = filterKeys.length > 0 || updates.pageSize !== undefined;

      if (shouldResetPage && !isPageUpdatedManually) {
        newParams.set('page', '1');
      }

      const queryString = newParams.toString();
      navigate(queryString ? `?${queryString}` : '.', {
        replace: true,
        state: location.state,
      });
    },
    [location, navigate]
  );

  return {
    pageIndex,
    pageSize,
    search,
    status,
    parentId,
    updateParams,
  };
}
