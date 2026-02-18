import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { homeService } from '@/services/home.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';
import type {
  CategoryShowcaseSection,
  ServiceItem,
  ServiceSuggestionApiResponse,
} from '@/types/home';

import { CarouselRowSkeleton } from './LoadingHome';
import { ServiceCard } from './ServiceCard';

interface CategoryShowcaseBlockProps {
  section: CategoryShowcaseSection;
  // forcedCategoryId?: string | null;
}

export default function CategoryShowcaseSection({ section }: CategoryShowcaseBlockProps) {
  const navigate = useNavigate();
  const { city } = useAppSelector((s: RootState) => s.location);

  const { title, subTitle, limit } = section;
  const categoryId = section.categoryId;

  const { data: services = [], isLoading } = useQuery<
    ServiceSuggestionApiResponse,
    Error,
    ServiceItem[]
  >({
    queryKey: ['servicesByCategory', categoryId, limit],
    queryFn: () => homeService.getServicesByCategory(categoryId, limit),
    select: res => res.services,
    enabled: !!categoryId,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });

  const goToCategory = (categoryId: string) => {
    navigate(
      `/services?category=${encodeURIComponent(categoryId)}&location=${encodeURIComponent(city)}`
    );
  };

  const goToSubService = (categoryId: string, serviceId: string) => {
    navigate(
      `/services?category=${encodeURIComponent(categoryId)}&service=${encodeURIComponent(serviceId)}&location=${encodeURIComponent(city)}`
    );
  };

  return (
    <section className="py-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-start mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          <p className="text-xl text-muted-foreground">{subTitle}</p>
        </div>
        {isLoading ? (
          <CarouselRowSkeleton />
        ) : (
          <AppCarousel
            items={services}
            renderItem={(service: ServiceItem) => (
              <ServiceCard
                service={service}
                onServiceClick={goToCategory}
                onSubServiceClick={goToSubService}
              />
            )}
            className="min-[550px]:basis-1/2 md:basis-1/3"
          />
        )}
      </div>
    </section>
  );
}
