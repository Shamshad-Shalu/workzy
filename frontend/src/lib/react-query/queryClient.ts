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
        console.log('Mutation Error in React Query:', error);
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 401) {
            return;
          }
        }
        toast.error(handleApiError(error));
      },
    },
  },
});
