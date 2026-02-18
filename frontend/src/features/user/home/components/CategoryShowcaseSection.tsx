import { useQuery } from '@tanstack/react-query';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { homeService } from '@/services/home.service';
import type {
  CategoryShowcaseSection,
  ServiceItem,
  ServiceSuggestionApiResponse,
} from '@/types/home';

import { ServiceCard } from './ServiceCard';

interface CategoryShowcaseBlockProps {
  section: CategoryShowcaseSection;
}

export default function CategoryShowcaseSection({ section }: CategoryShowcaseBlockProps) {
  const { title, subTitle, categoryId, limit } = section;

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

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-start mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
          <p className="text-xl text-muted-foreground">{subTitle}</p>
        </div>
        {isLoading ? (
          <div>Loading services...</div>
        ) : (
          <AppCarousel
            items={services}
            renderItem={(service: ServiceItem) => <ServiceCard service={service} />}
            className="min-[550px]:basis-1/2 md:basis-1/3"
          />
        )}
      </div>
    </section>
  );
}
