import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CategoryService from '@/services/category.service';

export const useCategoryLevels = (categoryId: string | undefined) => {
  const [level1Id, setLevel1Id] = useState<string>('');
  const [level2Id, setLevel2Id] = useState<string>('');
  const [level3Id, setLevel3Id] = useState<string>(categoryId ?? '');

  useEffect(() => {
    setLevel3Id(categoryId ?? '');
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

  const { data: l3Options = [], isFetching: isL3Loading } = useQuery({
    queryKey: ['categories', level2Id],
    queryFn: () => CategoryService.getCategoryLevels(3, level2Id),
    enabled: !!level2Id,
    select: data => data.map(c => ({ label: c.name, value: c.id })),
  });

  const { data: category, isFetching: isDetailsLoading } = useQuery({
    queryKey: ['category-details', level3Id],
    queryFn: () => CategoryService.getCategory(level3Id),
    enabled: !!level3Id,
  });

  const handleL1Change = (val: string) => {
    setLevel1Id(val);
    setLevel2Id('');
    setLevel3Id('');
  };

  const handleL2Change = (val: string) => {
    setLevel2Id(val);
    setLevel3Id('');
  };

  return {
    state: { level1Id, level2Id, level3Id },
    handlers: { handleL1Change, handleL2Change, setLevel3Id },
    options: { l1Options, l2Options, l3Options },
    loading: { isL2Loading, isL3Loading, isDetailsLoading },
    category,
  };
};
