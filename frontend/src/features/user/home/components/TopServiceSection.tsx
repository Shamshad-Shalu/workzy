import { ArrowRight, TrendingUp } from 'lucide-react';

import { AppCarousel } from '@/components/molecules/AppCarousel';

export interface TopService {
  id: string;
  name: string;
  imageUrl: string;
  bookings: string;
}

interface TopServiceSectionProps {
  topServices: TopService[];
}

export default function TopServiceSection({ topServices }: TopServiceSectionProps) {
  return (
    <section className="py-16 bg-section-blue">
      {/* bg-gradient-to-br from-indigo-50 to-purple-50  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-indigo-600 text-sm mb-3 shadow-md">
              <TrendingUp className="w-4 h-4" />
              Most Popular
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Top Booked Services
            </h2>
            <p className="text-muted-foreground">Join thousands of satisfied customers</p>
          </div>
        </div>

        <AppCarousel
          items={topServices}
          renderItem={service => <TopService key={service.id} service={service} />}
          className="pl-4 basis-full min-[400px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
        />
      </div>
    </section>
  );
}

export const TopService = ({ service }: { service: TopService }) => {
  return (
    <div
      className="
        w-full xl:w-56 min-[400px]-w-64 flex-shrink-0   
        bg-light rounded-xl overflow-hidden
        border border-muted-foreground/10
        shadow-md hover:shadow-xl
        transition-all duration-300
        cursor-pointer group
        hover:-translate-y-1
      "
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600">
          {service.bookings}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-dark group-hover:text-indigo-600  dark:group-hover:text-indigo-400 transition-colors">
            {service.name}
          </h4>

          <button
            className="
              p-2 rounded-full
              bg-indigo-50 text-indigo-600
              group-hover:bg-indigo-600
              group-hover:text-white
              transition-all
            "
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
