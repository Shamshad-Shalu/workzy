import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AdminHomeService } from '@/services/admin/home.service';
import type { ListType } from '@/types/admin/home';

interface HomeSectionProps {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  type: ListType;
}

export function useHomeSections({
  pageIndex = 1,
  pageSize = 10,
  type,
  search = '',
  status = 'all',
}: HomeSectionProps) {
  const queryClient = useQueryClient();

  const {
    data: sectionData,
    error: sectionsError,
    isLoading: sectionsIsLoading,
  } = useQuery({
    queryKey: ['admin-home-sections'],
    queryFn: () =>
      AdminHomeService.getSections({ page: pageIndex, limit: pageSize, search, status, type }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateSection = useMutation({
    mutationFn: (sectionId: string) => AdminHomeService.updateSection(sectionId),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] });
    },
  });

  return {
    sectionData,
    sectionsError,
    sectionsIsLoading,
    updateSection,
  };
}
