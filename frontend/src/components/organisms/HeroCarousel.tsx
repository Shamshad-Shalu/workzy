// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// interface SlideData {
//   imageUrl: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   category: string;
//   cta?: string;
// }

// interface HeroData {
//   type: string;
//   autoPlay: boolean;
//   interval: number;
//   slides: SlideData[];
// }

// interface CoreCarouselProps {
//   options?: any;
//   autoplay?: boolean;
//   autoplayDelay?: number;
//   onInit?: (api: any) => void;
//   children: React.ReactNode;
// }

// interface HeroCarouselProps {
//   data: HeroData;
//   stats: Record<string, string>;
//   onCategoryClick?: (category: string) => void;
// }

// function CoreCarousel({
//   options,
//   autoplay = false,
//   autoplayDelay = 6000,
//   onInit,
//   children,
// }: CoreCarouselProps) {
//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     options,
//     autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : []
//   );

//   useEffect(() => {
//     if (emblaApi && onInit) {onInit(emblaApi);}
//   }, [emblaApi, onInit]);

//   return (
//     <div ref={emblaRef} className="overflow-hidden h-full">
//       {children}
//     </div>
//   );
// }

// export function HeroCarousel({ data, stats, onCategoryClick }: HeroCarouselProps) {
//   const [api, setApi] = useState<any>(null);
//   const [current, setCurrent] = useState(0);

//   return (
//     // <header className="relative h-[500px] lg:h-[600px] overflow-hidden mt-16">
//     <section className="relative h-[500px] lg:h-[600px] overflow-hidden ">
//       <CoreCarousel
//         autoplay={data.autoPlay}
//         autoplayDelay={data.interval}
//         options={{ loop: true }}
//         onInit={(embla) => {
//           setApi(embla);
//           setCurrent(embla.selectedScrollSnap());
//           embla.on("select", () =>
//             setCurrent(embla.selectedScrollSnap())
//           );
//         }}
//       >
//         <div className="flex h-full">
//           {data.slides.map((slide: SlideData, i: number) => (
//             <div key={i} className="flex-shrink-0 w-full h-full relative">
//               <img
//                 src={slide.imageUrl}
//                 alt={slide.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
//             </div>
//           ))}
//         </div>
//       </CoreCarousel>

//       {/* Navigation Arrows */}
//       {data.slides.length > 1 && (
//         <>
//           <button
//             onClick={() => api?.scrollPrev()}
//             className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
//           </button>

//           <button
//             onClick={() => api?.scrollNext()}
//             className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
//             aria-label="Next slide"
//           >
//             <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
//           </button>
//         </>
//       )}

//       {/* Dots Indicator */}
//       {data.slides.length > 1 && (
//         <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//           {data.slides.map((_: SlideData, i: number) => (
//             <button
//               key={i}
//               onClick={() => api?.scrollTo(i)}
//               className={`h-1.5 lg:h-2 rounded-full transition-all ${
//                 i === current ? "bg-white w-6 lg:w-8" : "bg-white/50 w-1.5 lg:w-2"
//               }`}
//               aria-label={`Go to slide ${i + 1}`}
//             />
//           ))}
//         </div>
//       )}

//       <div className="absolute inset-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl h-full flex flex-col justify-between py-12 lg:py-16">

//           {/* SLIDE CONTENT (fixed vertical space) */}
//           <div className="min-h-[260px] lg:min-h-[340px]">
//             {data.slides.map((slide, index) => (
//               <div
//                 key={index}
//                 className={`transition-all duration-700 ${
//                   index === current
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 absolute pointer-events-none"
//                 }`}
//               >
//                 <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-xs lg:text-sm mb-4 lg:mb-6 border border-white/20">
//                   <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
//                   {slide.category}
//                 </div>

//                 {/* Title */}
//                 <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-3 lg:mb-6 leading-tight">
//                   {slide.title}
//                   <br />
//                   <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
//                     {slide.subtitle}
//                   </span>
//                 </h1>

//                 {/* Description */}
//                 <p className="text-base lg:text-xl text-white/90 mb-6 lg:mb-8 max-w-2xl">
//                   {slide.description}
//                 </p>

//                 {/* CTA Button */}
//                 <button
//                   onClick={() => onCategoryClick?.(slide.category)}
//                   className="group inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-white text-gray-900 rounded-xl lg:rounded-2xl font-semibold hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
//                 >
//                   {slide.cta || 'Explore Services'}
//                   <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* STATS (anchored) */}
//           <div className="grid grid-cols-4 gap-2 lg:gap-3">
//             {Object.entries(stats).map(([key, value]) => (
//               <div
//                 key={key}
//                 className="bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl p-2 lg:p-3 border border-white/20 text-center"
//               >
//                 <div className="text-lg lg:text-2xl font-bold text-white">{value}</div>
//                 <div className="text-white/80 text-[10px] lg:text-xs capitalize">
//                   {key}
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Button from '../atoms/Button';

/* ------------------ Types ------------------ */

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

/* ------------------ Core Carousel ------------------ */

function CoreCarousel({
  children,
  options,
  autoplay,
  autoplayDelay = 5000,
  onInit,
}: {
  children: React.ReactNode;
  options?: any;
  autoplay?: boolean;
  autoplayDelay?: number;
  onInit?: (api: any) => void;
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
  const [api, setApi] = useState<any>(null);
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

// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//  type CarouselApi,
// } from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";

// interface SlideData {
//   imageUrl: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   category: string;
//   cta?: string;
// }

// interface HeroData {
//   type: string;
//   autoPlay: boolean;
//   interval: number;
//   slides: SlideData[];
// }

// interface HeroCarouselProps {
//   data: HeroData;
//   renderSlide: (slide: SlideData, index: number, isActive: boolean) => React.ReactNode;
//   className?: string;
// }

// export function HeroCarousel({ data, renderSlide, className }: HeroCarouselProps) {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (!api) return;

//     setCurrent(api.selectedScrollSnap());

//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap());
//     });
//   }, [api]);

//   return (
//     <section className={`relative h-[500px] lg:h-[600px] overflow-hidden ${className || ''}`}>
//       <Carousel
//         setApi={setApi}
//         opts={{ loop: true }}
//         plugins={
//           data.autoPlay
//             ? [Autoplay({ delay: data.interval, stopOnInteraction: false })]
//             : []
//         }
//         className="h-full"
//       >
//         <CarouselContent className="h-full ml-0">
//           {data.slides.map((slide: SlideData, i: number) => (
//             <CarouselItem key={i} className="h-full pl-0">
//               {renderSlide(slide, i, i === current)}
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         {/* Navigation Arrows */}
//         {data.slides.length > 1 && (
//           <>
//             <button
//               onClick={() => api?.scrollPrev()}
//               className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
//               aria-label="Previous slide"
//             >
//               <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
//             </button>

//             <button
//               onClick={() => api?.scrollNext()}
//               className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 lg:p-3 rounded-full transition-all"
//               aria-label="Next slide"
//             >
//               <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
//             </button>
//           </>
//         )}

//         {/* Dots Indicator */}
//         {data.slides.length > 1 && (
//           <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//             {data.slides.map((_: SlideData, i: number) => (
//               <button
//                 key={i}
//                 onClick={() => api?.scrollTo(i)}
//                 className={`h-1.5 lg:h-2 rounded-full transition-all ${
//                   i === current ? "bg-white w-6 lg:w-8" : "bg-white/50 w-1.5 lg:w-2"
//                 }`}
//                 aria-label={`Go to slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </Carousel>
//     </section>
//   );
// }

// // Demo implementation showing how to use it
// import { Sparkles, ArrowRight } from "lucide-react";

// const API_DATA = {
//   hero: {
//     type: "carousel",
//     autoPlay: true,
//     interval: 6000,
//     slides: [
//       {
//         imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600",
//         title: "Transform Your",
//         subtitle: "Living Space",
//         description: "Expert home services at your fingertips. From repairs to renovations, we've got you covered.",
//         category: "Home Services",
//         cta: "Explore Services"
//       },
//       {
//         imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600",
//         title: "Professional",
//         subtitle: "Cleaning Services",
//         description: "Sparkling clean homes and offices. Book trusted professionals for a spotless space.",
//         category: "Cleaning",
//         cta: "Book Now"
//       },
//       {
//         imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600",
//         title: "Expert",
//         subtitle: "Repairs & Maintenance",
//         description: "Fast, reliable repairs for your home. Quality workmanship guaranteed.",
//         category: "Repairs",
//         cta: "Get Started"
//       }
//     ]
//   },
//   stats: {
//     services: "50+",
//     workers: "1000+",
//     bookings: "5000+",
//     rating: "4.9★"
//   }
// };

// // Hero Card Component - This is what you pass to render
// export function  HeroCard({
//   slide,
//   isActive,
//   stats,
//   onCategoryClick
// }: {
//   slide: SlideData;
//   isActive: boolean;
//   stats?: Record<string, string>;
//   onCategoryClick?: (category: string) => void;
// }) {
//   return (
//     <div className="relative w-full h-full">
//       {/* Background Image */}
//       <img
//         src={slide.imageUrl}
//         alt={slide.title}
//         className="w-full h-full object-cover"
//       />
//       <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

//       {/* Content Overlay */}
//       <div className="absolute inset-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
//         <div className="max-w-3xl">
//           <div
//             className={`transition-all duration-700 ${
//               isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//             }`}
//           >
//             {/* Category Badge */}
//             <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-xs lg:text-sm mb-4 lg:mb-6 border border-white/20">
//               <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
//               {slide.category}
//             </div>

//             {/* Title */}
//             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-3 lg:mb-6 leading-tight">
//               {slide.title}
//               <br />
//               <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
//                 {slide.subtitle}
//               </span>
//             </h1>

//             {/* Description */}
//             <p className="text-base lg:text-xl text-white/90 mb-6 lg:mb-8 max-w-2xl">
//               {slide.description}
//             </p>

//             {/* CTA Button */}
//             <button
//               onClick={() => onCategoryClick?.(slide.category)}
//               className="group inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-white text-gray-900 rounded-xl lg:rounded-2xl font-semibold hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
//             >
//               {slide.cta || 'Explore Services'}
//               <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
//             </button>

//             {/* Stats - Positioned below content */}
//             {stats && (
//               <div className="grid grid-cols-4 gap-2 lg:gap-3 mt-12 lg:mt-16">
//                 {Object.entries(stats).map(([key, value]) => (
//                   <div
//                     key={key}
//                     className="bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl p-2 lg:p-3 border border-white/20 text-center"
//                   >
//                     <div className="text-lg lg:text-2xl font-bold text-white">{value}</div>
//                     <div className="text-white/80 text-[10px] lg:text-xs capitalize">{key}</div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Demo Usage
// export default function Demo() {
//   const handleCategoryClick = (category: string) => {
//     console.log("Category clicked:", category);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {API_DATA.hero.type === 'carousel' ? (
//         <HeroCarousel
//           data={API_DATA.hero}
//           renderSlide={(slide, index, isActive) => (
//             <HeroCard
//               slide={slide}
//               isActive={isActive}
//               stats={API_DATA.stats}
//               onCategoryClick={handleCategoryClick}
//             />
//           )}
//         />
//       ) : (
//         // Static hero
//         <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
//           <HeroCard
//             slide={API_DATA.hero.slides[0]}
//             isActive={true}
//             stats={API_DATA.stats}
//             onCategoryClick={handleCategoryClick}
//           />
//         </section>
//       )}

//       {/* Rest of your page content */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold mb-4">How It Works</h2>
//         <p className="text-gray-600">Your content continues here...</p>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   type CarouselApi,
// } from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";

// interface SlideData {
//   imageUrl: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   category: string;
//   cta?: string;
// }

// interface HeroData {
//   type: string;
//   autoPlay: boolean;
//   interval: number;
//   slides: SlideData[];
// }

// interface HeroCarouselProps {
//   data: HeroData;
//   renderSlide: (slide: SlideData, index: number, isActive: boolean) => React.ReactNode;
//   className?: string;
// }

// export function HeroCarousel({ data, renderSlide, className }: HeroCarouselProps) {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     if (!api) return;

//     setCurrent(api.selectedScrollSnap());

//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap());
//     });
//   }, [api]);

//   return (
//     <section className={`relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px] overflow-hidden ${className || ''}`}>
//       <Carousel
//         setApi={setApi}
//         opts={{ loop: true }}
//         plugins={
//           data.autoPlay
//             ? [Autoplay({ delay: data.interval, stopOnInteraction: false })]
//             : []
//         }
//         // className="h-full"
//       >
//         <CarouselContent className="h-full ml-0">
//           {data.slides.map((slide: SlideData, i: number) => (
//             <CarouselItem key={i} className="h-full pl-0">
//               {renderSlide(slide, i, i === current)}
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         {/* Navigation Arrows */}
//         {data.slides.length > 1 && (
//           <>
//             <button
//               onClick={() => api?.scrollPrev()}
//               className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-2.5 lg:p-3 rounded-full transition-all"
//               aria-label="Previous slide"
//             >
//               <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//             </button>

//             <button
//               onClick={() => api?.scrollNext()}
//               className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-2.5 lg:p-3 rounded-full transition-all"
//               aria-label="Next slide"
//             >
//               <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
//             </button>
//           </>
//         )}

//         {/* Dots Indicator */}
//         {data.slides.length > 1 && (
//           <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
//             {data.slides.map((_: SlideData, i: number) => (
//               <button
//                 key={i}
//                 onClick={() => api?.scrollTo(i)}
//                 className={`h-1 sm:h-1.5 lg:h-2 rounded-full transition-all ${
//                   i === current ? "bg-white w-5 sm:w-6 lg:w-8" : "bg-white/50 w-1 sm:w-1.5 lg:w-2"
//                 }`}
//                 aria-label={`Go to slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </Carousel>
//     </section>
//   );
// }

// // Demo implementation showing how to use it
// import { Sparkles, ArrowRight } from "lucide-react";

// const API_DATA = {
//   hero: {
//     type: "carousel",
//     autoPlay: true,
//     interval: 6000,
//     slides: [
//       {
//         imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600",
//         title: "Transform Your",
//         subtitle: "Living Space",
//         description: "Expert home services at your fingertips. From repairs to renovations, we've got you covered.",
//         category: "Home Services",
//         cta: "Explore Services"
//       },
//       {
//         imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600",
//         title: "Professional",
//         subtitle: "Cleaning Services",
//         description: "Sparkling clean homes and offices. Book trusted professionals for a spotless space.",
//         category: "Cleaning",
//         cta: "Book Now"
//       },
//       {
//         imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600",
//         title: "Expert",
//         subtitle: "Repairs & Maintenance",
//         description: "Fast, reliable repairs for your home. Quality workmanship guaranteed.",
//         category: "Repairs",
//         cta: "Get Started"
//       }
//     ]
//   },
//   stats: {
//     services: "50+",
//     workers: "1000+",
//     bookings: "5000+",
//     rating: "4.9★"
//   }
// };

// // Hero Card Component - This is what you pass to render
// export function HeroCard({
//   slide,
//   isActive,
//   stats,
//   onCategoryClick
// }: {
//   slide: SlideData;
//   isActive: boolean;
//   stats?: Record<string, string>;
//   onCategoryClick?: (category: string) => void;
// }) {
//   return (
//     <div className="relative">
//       {/* Background Image */}
//       <img
//         src={slide.imageUrl}
//         alt={slide.title}
//         className="w-full h-full object-cover object-center"
//       />
//       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

//       {/* Content Overlay */}
//       <div className="absolute inset-0 z-10">
//         <div className="h-full flex items-center">
//           <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="max-w-lg sm:max-w-xl lg:max-w-2xl">
//               <div
//                 className={`transition-all duration-700 ${
//                   isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                 }`}
//               >
//                 {/* Category Badge */}
//                 <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 lg:px-4 py-1.5 sm:py-1.5 lg:py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-xs sm:text-xs lg:text-sm mb-3 sm:mb-4 lg:mb-5 border border-white/20">
//                   <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
//                   {slide.category}
//                 </div>

//                 {/* Title */}
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 lg:mb-5 leading-tight">
//                   {slide.title}
//                   <br />
//                   <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
//                     {slide.subtitle}
//                   </span>
//                 </h1>

//                 {/* Description */}
//                 <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/90 mb-5 sm:mb-6 lg:mb-7 leading-relaxed">
//                   {slide.description}
//                 </p>

//                 {/* CTA Button */}
//                 <button
//                   onClick={() => onCategoryClick?.(slide.category)}
//                   className="group inline-flex items-center gap-2 px-5 sm:px-6 lg:px-7 xl:px-8 py-2.5 sm:py-3 lg:py-3.5 xl:py-4 bg-white text-gray-900 rounded-xl lg:rounded-2xl text-sm sm:text-base font-semibold hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
//                 >
//                   {slide.cta || 'Explore Services'}
//                   <ArrowRight className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 {stats && (
//                   <div className="grid grid-cols-4 gap-2 sm:gap-2.5 lg:gap-3 mt-8 sm:mt-10 lg:mt-12">
//                     {Object.entries(stats).map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="bg-white/10 backdrop-blur-md rounded-lg lg:rounded-xl p-2 sm:p-2.5 lg:p-3 border border-white/20 text-center"
//                       >
//                         <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white">{value}</div>
//                         <div className="text-white/80 text-[9px] sm:text-[10px] lg:text-xs capitalize mt-0.5">{key}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Demo Usage
// export default function Demo() {
//   const handleCategoryClick = (category: string) => {
//     console.log("Category clicked:", category);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {API_DATA.hero.type === 'carousel' ? (
//         <HeroCarousel
//           data={API_DATA.hero}
//           renderSlide={(slide, index, isActive) => (
//             <HeroCard
//               slide={slide}
//               isActive={isActive}
//               stats={API_DATA.stats}
//               onCategoryClick={handleCategoryClick}
//             />
//           )}
//         />
//       ) : (
//         // Static hero
//         <section className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[650px] overflow-hidden">
//           <HeroCard
//             slide={API_DATA.hero.slides[0]}
//             isActive={true}
//             stats={API_DATA.stats}
//             onCategoryClick={handleCategoryClick}
//           />
//         </section>
//       )}

//       {/* Rest of your page content */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold mb-4">How It Works</h2>
//         <p className="text-gray-600">Your content continues here...</p>
//       </div>
//     </div>
//   );
// }
