import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { homeService } from '@/services/home.service';
import type { ServiceItem, ServiceSuggestionApiResponse } from '@/types/home/home';
import type { CategoryShowcaseContent } from '@/types/home/home.sectionContent';

import { CarouselRowSkeleton } from './LoadingHome';
import { ServiceCard } from './ServiceCard';

interface CategoryShowcaseBlockProps {
  section: CategoryShowcaseContent;
}

export default function CategoryShowcaseSection({ section }: CategoryShowcaseBlockProps) {
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

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-start">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-foreground">{title}</h2>
            <p className="text-lg text-muted-foreground font-medium">{subTitle}</p>
          </div>

          <Link
            to={`/services?category=${categoryId}`}
            className="group inline-flex items-center gap-2 text-primary font-semibold text-sm md:text-base transition-all hover:gap-3"
          >
            See All
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {isLoading ? (
          <CarouselRowSkeleton />
        ) : (
          <AppCarousel
            items={services}
            renderItem={(service: ServiceItem) => (
              <ServiceCard key={service.id} service={service} />
            )}
            className="min-[550px]:basis-1/2 md:basis-1/3 lg:basis-1/4"
          />
        )}
      </div>
    </section>
  );
}
