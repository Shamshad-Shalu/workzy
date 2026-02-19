import api from '@/lib/api/axios';
import type {
  HomeApiResponse,
  ServiceSuggestionApiResponse,
  TopServicesApiResponse,
  WorkersApiResponse,
} from '@/types/home';

import { CATEGORY_API, HOME_API } from '../constants/apiRoutes';

interface NearbyProps {
  radius: number;
  limit: number;
  lat: number;
  lng: number;
}

export const homeService = {
  getHomeSections: async (): Promise<HomeApiResponse> => {
    const res = await api.get(HOME_API.ROOT);
    return res.data;
  },
  getNearbyWorkers: async (props: NearbyProps): Promise<WorkersApiResponse> => {
    const res = await api.get(HOME_API.NEARBY_WORKERS, { params: props });
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
