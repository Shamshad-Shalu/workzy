import { AnimatePresence, motion, type MotionProps } from 'framer-motion';
import { ChevronDown, ChevronUp, LayoutGrid, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/molecules/EmptyState';
import { SERVICE_TYPE } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRadius } from '@/store/slices/locationSlice';
import type { RootState } from '@/store/store';
import type { CategoryLite } from '@/types/category';
import type { WorkerListingInfo } from '@/types/worker';

import BookingModal from '../../booking/components/bookingForm/BookingModal';
import CategoryShowcaseSection from '../../home/components/CategoryShowcaseSection';
import { CarouselRowSkeleton } from '../../home/components/LoadingHome';
import FilterSidebar from '../components/FilterSidebar';
import { ServiceCard } from '../components/ServiceCard';
import ServiceCardSkeleton from '../components/ServiceCardSkeleton';
import { WorkerList, type WorkerListParams } from '../components/WorkerList';
import { getFilterConfig } from '../helper/filterConfig';
import {
  useCategoryShowcases,
  useListingServices,
  useListWorkers,
  useServiceDetails,
} from '../hooks/useServices';

const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: 'easeOut' },
});

export default function ServicesPage() {
  const [bookingWorker, setBookingWorker] = useState<WorkerListingInfo | null>(null);
  const { radius } = useAppSelector((s: RootState) => s.location);
  const dispatch = useAppDispatch();

  const handleRadiusChange = (val: number) => {
    dispatch(setRadius(val));
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [availableNow, setAvailableNow] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const categoryId = searchParams.get('category');
  const serviceId = searchParams.get('service');
  const hasCategory = !!categoryId;
  const hasService = !!serviceId;

  const { latitude, longitude } = useAppSelector((s: RootState) => s.location);
  const { data: services = [], isLoading: isServicesLoading } = useListingServices(3, categoryId);
  const { data: selectedService } = useServiceDetails(serviceId);
  const filterConfig = useMemo(() => getFilterConfig(selectedService ?? null), [selectedService]);
  const isRemote = selectedService?.serviceType === SERVICE_TYPE.REMOTE;

  const filterParams = useMemo(
    () => ({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: minRating || undefined,
      availableNow: availableNow || undefined,
      ...(!isRemote && latitude && longitude
        ? { lat: latitude, lng: longitude, radiusKm: radius }
        : {}),
    }),
    [priceRange, minRating, availableNow, isRemote, latitude, longitude, radius]
  );

  const debouncedFilterParams = useDebounce(filterParams, 600);
  const workerParams: WorkerListParams = useMemo(
    () => ({ page, limit, ...debouncedFilterParams }),
    [page, limit, debouncedFilterParams]
  );

  const { data, isLoading: isWorkersLoading } = useListWorkers(serviceId, workerParams);
  const { showcases } = useCategoryShowcases();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  useEffect(() => {
    setPage(1);
    if (!hasService) {
      setPriceRange([0, 10000]);
      return;
    }
    setMinRating(0);
    setAvailableNow(false);
    setPriceRange([filterConfig.minPrice, filterConfig.maxPrice]);
  }, [hasService, filterConfig.minPrice, filterConfig.maxPrice]);

  useEffect(() => {
    setPage(1);
  }, [radius, priceRange, minRating, availableNow]);

  const resetFilters = () => {
    setPage(1);
    setMinRating(0);
    setAvailableNow(false);
    setPriceRange(hasService ? [filterConfig.minPrice, filterConfig.maxPrice] : [0, 10000]);
  };

  const handleServiceSelect = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('service', id);
    setSearchParams(params);
  };

  const handleBackToServices = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('service');
    setSearchParams(params);
  };

  const visibleServices = showAllServices ? services : services.slice(0, 6);

  return (
    <main className="min-h-screen section-container py-6 flex flex-col gap-6">
      <motion.button
        {...fadeUp(0)}
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded-xl font-medium text-sm shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </motion.button>

      <div className="flex gap-6 items-start">
        {hasCategory && hasService && (
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filterConfig={filterConfig}
            radius={radius}
            setRadius={handleRadiusChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            availableNow={availableNow}
            setAvailableNow={setAvailableNow}
            resetFilters={resetFilters}
            isServiceSelected={hasService}
          />
        )}

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <AnimatePresence mode="wait">
            {hasCategory && (
              <motion.div key="service-picker" {...fadeUp(0)}>
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Select a Service</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {hasService
                          ? 'Service selected — adjust filters or browse professionals below.'
                          : 'Pick a service to see available professionals.'}
                      </p>
                    </div>
                    {services.length > 6 && (
                      <button
                        onClick={() => setShowAllServices(!showAllServices)}
                        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline flex-shrink-0"
                      >
                        {showAllServices ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" /> Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" /> View all
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {isServicesLoading
                      ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                      : visibleServices.map((service: CategoryLite) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            isActive={serviceId === service.id}
                            onSelect={handleServiceSelect}
                          />
                        ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!hasCategory && (
              <motion.div key="no-cat" {...fadeUp(0)}>
                <EmptyState
                  icon={<Search className="w-6 h-6" />}
                  title="Find the right professional"
                  description="Select a category from the navigation to browse available services near you."
                  hint="Try: Electrical · Plumbing · Cleaning · Carpentry"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasCategory && !hasService && (
              <motion.div key="no-service" {...fadeUp(0.05)}>
                <EmptyState
                  icon={<LayoutGrid className="w-6 h-6" />}
                  title="Now pick a service"
                  description="Choose one of the services above to unlock filters and view matching professionals."
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasService && (
              <motion.div key="workers" {...fadeUp(0.05)} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">
                      Available Professionals
                      {data?.total ? (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({data.total} found)
                        </span>
                      ) : null}
                    </h2>
                    {selectedService && (
                      <p className="text-xs text-muted-foreground mt-0.5">{selectedService.name}</p>
                    )}
                  </div>
                  <button
                    onClick={handleBackToServices}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 rounded-lg hover:bg-muted"
                  >
                    ← Back
                  </button>
                </div>

                <WorkerList
                  workers={data?.workers ?? []}
                  isLoading={isWorkersLoading}
                  total={data?.total ?? 0}
                  page={page}
                  limit={limit}
                  onPageChange={setPage}
                  onBook={worker => setBookingWorker(worker)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 w-full flex flex-col gap-2">
        {showcases.length === 0
          ? Array.from({ length: 3 }).map((_, i) => <CarouselRowSkeleton key={i} />)
          : showcases.map(section => (
              <CategoryShowcaseSection key={section.categoryId} section={section} />
            ))}
      </div>
      {bookingWorker && (
        <BookingModal
          open={!!bookingWorker}
          onClose={() => setBookingWorker(null)}
          worker={bookingWorker}
        />
      )}
    </main>
  );
}
