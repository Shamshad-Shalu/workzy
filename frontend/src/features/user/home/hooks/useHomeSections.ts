import { useQuery } from '@tanstack/react-query';

import { homeService } from '@/services/home.service';

export const useHomeSections = () => {
  const {
    data: homeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['homeSections'],
    queryFn: homeService.getHomeSections,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    homeData,
    isLoading,
    error,
  };
};
