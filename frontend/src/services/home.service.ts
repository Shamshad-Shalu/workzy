import api from '@/lib/api/axios';
import type {
  HomeApiResponse,
  ServiceSuggestionApiResponse,
  TopServicesApiResponse,
  WorkersApiResponse,
} from '@/types/home';

interface NearbyProps {
  radius: number;
  limit: number;
  lat: number;
  lng: number;
}

export const homeService = {
  getHomeSections: async (): Promise<HomeApiResponse> => {
    const res = await api.get('/home');
    return res.data;
  },
  getNearbyWorkers: async (props: NearbyProps): Promise<WorkersApiResponse> => {
    const res = await api.get('/home/nearby-workers', { params: props });
    return res.data;
  },
  getTopServices: async (limit: number): Promise<TopServicesApiResponse> => {
    const res = await api.get('/categories/top-services', { params: { limit } });
    return res.data;
  },
  getServicesByCategory: async (
    categoryId: string,
    limit: number
  ): Promise<ServiceSuggestionApiResponse> => {
    const res = await api.get(`/categories/${categoryId}/services`, { params: { limit } });
    return res.data;
  },
};
