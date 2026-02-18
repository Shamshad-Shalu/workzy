import { useRef, useState } from 'react';

import { HeroCarousel } from '@/components/organisms/HeroCarousel';
import { HOME_SECTION_TYPE } from '@/constants';
import BannerSection from '@/features/user/home/components/BannerSection';
import CategoryShowcaseSection from '@/features/user/home/components/CategoryShowcaseSection';
import CTASection from '@/features/user/home/components/CTASection';
import HowItWorksSection from '@/features/user/home/components/HowItWorksSection';
import LoadingHome from '@/features/user/home/components/LoadingHome';
import NearWorkersSection from '@/features/user/home/components/NearWorkersSection';
import TestimonialsSection from '@/features/user/home/components/TestimonialsSection';
import TopServiceSection from '@/features/user/home/components/TopServiceSection';
import TrustSection from '@/features/user/home/components/TrustSection';
import { useHomeSections } from '@/features/user/home/hooks/useHomeSections';

const appStats = {
  customers: '12M+',
  professionals: '50K+',
  rating: '4.8',
  services: '200+',
};

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categoryShowcaseRef = useRef<HTMLDivElement | null>(null);

  const { homeData, isLoading, error } = useHomeSections();

  if (isLoading) {
    return <LoadingHome />;
  }
  if (error || !homeData) {
    return <div className="p-6">Failed to load home</div>;
  }

  const sections = [...homeData.sections].sort((a, b) => a.order - b.order);

  const handleHeroCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    requestAnimationFrame(() => {
      categoryShowcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  console.log('Selected category:', selectedCategoryId);

  return (
    <main>
      {sections.map(section => {
        switch (section.type) {
          case HOME_SECTION_TYPE.HERO:
            return (
              <HeroCarousel
                key={section.order}
                data={section}
                stats={appStats}
                onCategoryClick={handleHeroCategoryClick}
              />
            );

          case HOME_SECTION_TYPE.CATEGORY_SHOWCASE:
            return (
              <div key={section.order} ref={categoryShowcaseRef}>
                <CategoryShowcaseSection section={section} />;
              </div>
            );

          case HOME_SECTION_TYPE.BANNER:
            return <BannerSection key={section.order} section={section} />;

          case HOME_SECTION_TYPE.TOP_SERVICES:
            return <TopServiceSection key={section.order} section={section} />;

          case HOME_SECTION_TYPE.NEARBY_WORKERS:
            return <NearWorkersSection key={section.order} section={section} />;

          case HOME_SECTION_TYPE.TESTIMONIALS:
            return (
              <TestimonialsSection
                key={section.order}
                testimonials={section.testimonials}
                title={section.title}
              />
            );

          case HOME_SECTION_TYPE.HOW_IT_WORKS:
            return <HowItWorksSection key={section.order} section={section} />;

          case HOME_SECTION_TYPE.WHY_CHOOSE:
            return <TrustSection key={section.order} section={section} />;

          default:
            return null;
        }
      })}

      <CTASection />
    </main>
  );
}
