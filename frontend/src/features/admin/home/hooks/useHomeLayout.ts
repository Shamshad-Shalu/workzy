import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AdminHomeService } from '@/services/admin/home.service';
import type { LayoutSectionItem } from '@/types/home/layoutSection';

export function useHomeLayout() {
  const queryClient = useQueryClient();

  const {
    data,
    error: layoutError,
    isLoading: layoutIsLoading,
  } = useQuery({
    queryKey: ['admin-home-layout'],
    queryFn: AdminHomeService.getLayout,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateLayout = useMutation({
    mutationFn: (items: LayoutSectionItem[]) => AdminHomeService.updateLayout({ items }),
    onSuccess: res => {
      queryClient.invalidateQueries({ queryKey: ['admin-home-layout'] });
      return res;
    },
  });

  return {
    layout: data?.layout,
    layoutError,
    layoutIsLoading,
    updateLayout,
  };
}
