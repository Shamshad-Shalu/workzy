import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { handleApiError } from '@/utils/handleApiError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      onError: error => {
        if (error instanceof AxiosError && error.status === 401) {
          return;
        }
        toast.error(handleApiError(error));
      },
    },
  },
});
