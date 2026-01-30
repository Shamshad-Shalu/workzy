import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import Button from '../atoms/Button';

interface SlideData {
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  cta?: string;
}

interface HeroData {
  type: string;
  autoPlay: boolean;
  interval: number;
  slides: SlideData[];
}

interface HeroCarouselProps {
  data: HeroData;
  stats: Record<string, string>;
  onCategoryClick?: (category: string) => void;
}


function CoreCarousel({
  children,
  options,
  autoplay,
  autoplayDelay = 5000,
  onInit,
}: {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  autoplay?: boolean;
  autoplayDelay?: number;
  onInit?: (api: EmblaCarouselType) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    options,
    autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : []
  );

  useEffect(() => {
    if (emblaApi && onInit) {
      onInit(emblaApi);
    }
  }, [emblaApi, onInit]);

  return (
    <div ref={emblaRef} className="overflow-hidden h-full">
      {children}
    </div>
  );
}

export function HeroCarousel({ data, stats, onCategoryClick }: HeroCarouselProps) {
  const [api, setApi] = useState<EmblaCarouselType | null >(null);
  const [current, setCurrent] = useState(0);

  return (
    <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
      <CoreCarousel
        autoplay={data.autoPlay}
        autoplayDelay={data.interval}
        options={{ loop: true }}
        onInit={embla => {
          setApi(embla);
          setCurrent(embla.selectedScrollSnap());
          embla.on('select', () => setCurrent(embla.selectedScrollSnap()));
        }}
      >
        <div className="flex h-full">
          {data.slides.map((slide, i) => (
            <div key={i} className="flex-shrink-0 w-full h-full relative">
              <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>
          ))}
        </div>
      </CoreCarousel>

      {data.slides.length > 1 && (
        <>
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {data.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[680px] xl:max-w-[720px] h-full flex flex-col justify-between py-12 lg:py-16">
          <div className="min-h-[260px] lg:min-h-[340px]">
            {data.slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === current
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 absolute pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-white text-xs mb-4 border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  {slide.category}
                </div>
                <h1
                  className="
                    text-4xl
                    sm:text-5xl
                    lg:text-6xl
                    xl:text-6xl
                    font-bold
                    text-white
                    mb-4
                    leading-tight
                  "
                >
                  {slide.title}
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                    {slide.subtitle}
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-white/90 mb-6 max-w-xl">
                  {slide.description}
                </p>
                <div className="mt-4">
                  <Button
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    variant="secondary"
                    onClick={() => onCategoryClick?.(slide.category)}
                    className="px-6 py-6 font-semibold"
                  >
                    {slide.cta || 'Explore Services'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 lg:gap-3">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="
                  bg-white/10 backdrop-blur-md
                  rounded-lg
                  p-2 lg:p-3
                  border border-white/20
                  text-center
                "
              >
                <div className="text-lg lg:text-xl font-bold text-white">{value}</div>
                <div className="text-white/80 text-[10px] lg:text-xs capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
