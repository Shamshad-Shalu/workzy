import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface CustomParamConfig {
  key: string;
  defaultValue?: string | number | null;
  parser?: (value: string) => unknown;
}
type Updates = Record<string, string | number | null | undefined>;

type StandardParams = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  updateParams: (updates: Updates) => void;
};

const createUpdateParamsFunction =
  (setSearchParams: ReturnType<typeof useSearchParams>[1]) => (updates: Updates) => {
    setSearchParams(
      prev => {
        const newParams = new URLSearchParams(prev);

        const filterKeys = Object.keys(updates).filter(
          k => !['page', 'pageIndex', 'pageSize'].includes(k)
        );

        Object.entries(updates).forEach(([key, value]) => {
          const paramKey = key === 'pageSize' ? 'limit' : key === 'pageIndex' ? 'page' : key;

          if (value === null || value === undefined || value === '') {
            newParams.delete(paramKey);
            return;
          }

          if (paramKey === 'page') {
            newParams.set('page', String(Number(value) + 1));
          } else {
            newParams.set(paramKey, String(value));
          }
        });

        const isPageUpdatedManually = updates.page !== undefined || updates.pageIndex !== undefined;
        const shouldResetPage = filterKeys.length > 0 || updates.pageSize !== undefined;

        if (shouldResetPage && !isPageUpdatedManually) {
          newParams.set('page', '0');
        }

        return newParams;
      },
      { replace: true }
    );
  };

export const useUrlFilterParams = <
  TCustom extends Record<string, unknown> = Record<string, unknown>,
>(
  customParams: CustomParamConfig[] = []
): StandardParams & TCustom => {
  const [searchParams, setSearchParams] = useSearchParams();

  const customParamsString = useMemo(() => JSON.stringify(customParams), [customParams]);

  const filterState = useMemo(() => {
    const standardParams = {
      pageIndex: Math.max(parseInt(searchParams.get('page') ?? '1', 10) - 1, 0),
      pageSize: parseInt(searchParams.get('limit') ?? '5', 10),
      search: searchParams.get('search') ?? '',
      status: searchParams.get('status') ?? 'all',
    };

    const customState = customParams.reduce((acc, config) => {
      const value = searchParams.get(config.key);
      const finalValue =
        value !== null
          ? config.parser
            ? config.parser(value)
            : value
          : (config.defaultValue ?? null);

      return { ...acc, [config.key]: finalValue };
    }, {} as TCustom);

    return { ...standardParams, ...customState };
  }, [searchParams, customParamsString]);

  const updateParams = useCallback(createUpdateParamsFunction(setSearchParams), [setSearchParams]);

  return {
    ...filterState,
    updateParams: updateParams,
  };
};
