import api from '@/lib/api/axios';
import type {
  HomeApiResponse,
  NearbyWorkerListQuery,
  NearbyWorkerListResponse,
  ServiceSuggestionApiResponse,
  TopServicesApiResponse,
} from '@/types/home/home';

import { CATEGORY_API, HOME_API } from '../constants/apiRoutes';

export const homeService = {
  getHomeSections: async (): Promise<HomeApiResponse> => {
    const res = await api.get(HOME_API.ROOT);
    return res.data;
  },
  getNearbyWorkers: async (params: NearbyWorkerListQuery): Promise<NearbyWorkerListResponse> => {
    const res = await api.get(HOME_API.NEARBY_WORKERS, { params });
    return res.data;
  },
  getTopServices: async (limit: number): Promise<TopServicesApiResponse> => {
    const res = await api.get(CATEGORY_API.TOP_SERVICES, { params: { limit } });
    return res.data;
  },
  getServicesByCategory: async (
    categoryId: string,
    limit: number
  ): Promise<ServiceSuggestionApiResponse> => {
    const res = await api.get(CATEGORY_API.SERVICE_SUGGESTIONS(categoryId), { params: { limit } });
    return res.data;
  },
};
