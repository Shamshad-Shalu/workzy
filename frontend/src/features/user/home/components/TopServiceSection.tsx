import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';

import { AppCarousel } from '@/components/molecules/AppCarousel';
import { homeService } from '@/services/home.service';
import type { TopServiceItem, TopServicesApiResponse } from '@/types/home/home';
import type { TopServicesContent } from '@/types/home/home.sectionContent';

interface TopServiceSectionProps {
  section: TopServicesContent;
}

export default function TopServiceSection({ section }: TopServiceSectionProps) {
  const { title, limit, subTitle } = section;

  const { data: services = [], isLoading } = useQuery<
    TopServicesApiResponse,
    Error,
    TopServiceItem[]
  >({
    queryKey: ['topServices', limit],
    queryFn: () => homeService.getTopServices(limit),
    select: res => res.services,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 bg-section-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-600 text-sm mb-3 shadow-md">
              <TrendingUp className="w-4 h-4" />
              Most Popular
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title || 'Top Booked Services'}
            </h2>
            <p className="text-muted-foreground">
              {subTitle || 'Join thousands of satisfied customers'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="basis-full min-[400px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex-shrink-0"
              >
                <div className="h-48 bg-muted rounded-xl animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded mt-3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <AppCarousel
            items={services}
            renderItem={(service: TopServiceItem) => (
              <TopService key={service.categoryId} service={service} />
            )}
            className="pl-4 basis-full min-[400px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          />
        )}
      </div>
    </section>
  );
}

export function TopService({ service }: { service: TopServiceItem }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex-shrink-0 bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600">
          {service.bookings}
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <h4 className="font-bold text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {service.name}
        </h4>
        <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}
