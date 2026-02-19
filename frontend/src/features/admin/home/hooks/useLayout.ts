import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AdminHomeService } from '@/services/admin/home.service';

export function useLayout() {
  const queryClient = useQueryClient();

  const {
    data: layout,
    error: layoutError,
    isLoading: layoutIsLoading,
  } = useQuery({
    queryKey: ['admin-home-layout'],
    queryFn: AdminHomeService.getLayout,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateLayout = useMutation({
    mutationFn: () => AdminHomeService.updateLayout(),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-home-layout'] });
    },
  });

  return {
    layout,
    layoutError,
    layoutIsLoading,
    updateLayout,
  };
}
