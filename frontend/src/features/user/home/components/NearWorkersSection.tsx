import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { homeService } from '@/services/home.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import type { NearbyWorkersSection, Worker, WorkersApiResponse } from '@/types/home';

import { WorkerCard } from './WorkerCard';

interface NearWorkersSectionProps {
  section: NearbyWorkersSection;
}
export default function NearWorkersSection({ section }: NearWorkersSectionProps) {
  const { title, subTitle, limit = 15, radiusKm = 100 } = section;
  const { latitude, longitude } = useAppSelector((state: RootState) => state.location);

  const {
    data: workers = [],
    error,
    isLoading,
  } = useQuery<WorkersApiResponse, Error, Worker[]>({
    queryKey: ['workers', latitude, longitude, radiusKm, limit],
    queryFn: () =>
      homeService.getNearbyWorkers({ radius: radiusKm, limit, lat: latitude, lng: longitude }),
    select: res => res.workers,
    staleTime: 10 * 60 * 1000, // 60 minutes
  });

  if (error) {
    console.error('Error fetching nearby workers:', error);
    return null;
  }
  if (workers.length === 0) {
    return null;
  }
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              In Your Area
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title || 'Professionals Near You'}
            </h2>
            <p className="text-gray-600">{subTitle || 'Verified experts ready to serve'}</p>
          </div>
        </div>

        {isLoading ? (
          <div>Loading nearby workers...</div>
        ) : (
          <AppCarousel
            items={workers}
            renderItem={worker => <WorkerCard key={worker.id} worker={worker} />}
            className="pl-5"
          />
        )}
      </div>
    </section>
  );
}
