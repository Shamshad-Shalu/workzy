import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import CategoryService from '@/services/category.service';

export const useCategoryLevels = (categoryId?: string) => {
  const [level1Id, setLevel1Id] = useState<string>('');
  const [level2Id, setLevel2Id] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categoryId ?? '');

  useEffect(() => {
    setSelectedCategoryId(categoryId ?? '');
  }, [categoryId]);

  const { data: l1Options = [] } = useQuery({
    queryKey: ['categories', 'level1'],
    queryFn: () => CategoryService.getCategoryLevels(1, null),
    select: data => data.map(c => ({ label: c.name, value: c.id })),
  });

  const { data: l2Options = [], isFetching: isL2Loading } = useQuery({
    queryKey: ['categories', level1Id],
    queryFn: () => CategoryService.getCategoryLevels(2, level1Id),
    enabled: !!level1Id,
    select: data => data.map(c => ({ label: c.name, value: c.id })),
  });

  const { data: category, isFetching: isDetailsLoading } = useQuery({
    queryKey: ['category-details', selectedCategoryId],
    queryFn: () => CategoryService.getCategory(selectedCategoryId),
    enabled: !!selectedCategoryId,
  });

  const handleL1Change = (val: string) => {
    setLevel1Id(val);
    setLevel2Id('');
    setSelectedCategoryId('');
  };

  const handleL2Change = (val: string) => {
    setLevel2Id(val);
    setSelectedCategoryId(val);
  };

  const resetLevels = () => {
    setLevel1Id('');
    setLevel2Id('');
    setSelectedCategoryId(categoryId ?? '');
  };

  return {
    state: { level1Id, level2Id },
    handlers: { handleL1Change, handleL2Change, resetLevels },
    options: { l1Options, l2Options },
    loading: { isL2Loading, isDetailsLoading },
    category,
  };
};
