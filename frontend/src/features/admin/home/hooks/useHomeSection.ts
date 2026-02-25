import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AdminHomeService, type HomeSectionFormType } from '@/services/admin/home.service';
import type { ListType } from '@/types/admin/home';

import type { HomeSectionFormData } from '../validation/section-schemas';

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
    queryKey: ['admin-home-sections', pageIndex, pageSize, search, status, type],
    queryFn: () =>
      AdminHomeService.getSections({ page: pageIndex + 1, limit: pageSize, search, status, type }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const addSection = useMutation({
    mutationFn: (data: HomeSectionFormData) => AdminHomeService.addSection(data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] });
    },
  });

  const updateSection = useMutation({
    mutationFn: ({ sectionId, data }: HomeSectionFormType) =>
      AdminHomeService.updateSection({ sectionId, data }),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] });
    },
  });

  const deleteSection = useMutation({
    mutationFn: (sectionId: string) => AdminHomeService.deleteSection(sectionId),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-home-sections'] });
    },
  });

  const updateSectionStatus = useMutation({
    mutationFn: (sectionId: string) => AdminHomeService.updateSectionStatus(sectionId),
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
    updateSectionStatus,
    addSection,
    deleteSection,
  };
}
