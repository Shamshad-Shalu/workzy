import { ArrowRight } from 'lucide-react';

import type { BannerContent } from '@/types/home/home.sectionContent';

interface Props {
  section: BannerContent;
}
export default function BannerSection({ section }: Props) {
  const { imageUrl, title, description, ctaText } = section;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl px-8 md:px-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h3>
            <p className="text-lg text-white/90 mb-6">{description}</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center gap-2 shadow-xl">
              {ctaText}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
