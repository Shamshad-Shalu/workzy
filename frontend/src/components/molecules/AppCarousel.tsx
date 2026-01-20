import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface AppCarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

export function AppCarousel<T>({ items, renderItem, className }: AppCarouselProps<T>) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-6 overflow-visible pb-4">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn('pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4', className)}
          >
            {renderItem(item)}
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden xl:flex -left-10" />
      <CarouselNext className="hidden xl:flex -right-10" />
    </Carousel>
  );
}
