import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { CategoryLite } from '@/types/category';

import FilterSidebar from '../components/FilterSidebar';
import { ServiceCard } from '../components/ServiceCard';
import ServiceCardSkeleton from '../components/ServiceCardSkeleton';
import { getFilterConfig } from '../helper/filterConfig';
import { useListingServices, useServiceDetails } from '../hooks/useServices';

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  const categoryId = searchParams.get('category');
  const serviceId = searchParams.get('service');

  const hasCategory = !!categoryId;
  const hasService = !!serviceId;

  const { data: services = [], isLoading: isServicesLoading } = useListingServices(3, categoryId);
  const { data: selectedService } = useServiceDetails(serviceId);

  const filterConfig = useMemo(() => getFilterConfig(selectedService ?? null), [selectedService]);

  const [radius, setRadius] = useState(10);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [availableNow, setAvailableNow] = useState(false);

  useEffect(() => {
    if (!hasService) {
      setPriceRange([0, 10000]);
      return;
    }
    setRadius(10);
    setMinRating(0);
    setAvailableNow(false);
    setPriceRange([filterConfig.minPrice, filterConfig.maxPrice]);
  }, [hasService, filterConfig.minPrice, filterConfig.maxPrice]);

  const resetFilters = () => {
    setRadius(10);
    setMinRating(0);
    setAvailableNow(false);
    if (hasService) {
      setPriceRange([filterConfig.minPrice, filterConfig.maxPrice]);
    } else {
      setPriceRange([0, 10000]);
    }
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

  return (
    <main className="min-h-screen section-container py-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      <div className="flex gap-6">
        <FilterSidebar
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filterConfig={filterConfig}
          radius={radius}
          setRadius={setRadius}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          availableNow={availableNow}
          setAvailableNow={setAvailableNow}
          resetFilters={resetFilters}
          isServiceSelected={hasService}
        />
        <main className="flex-1 min-w-0">
          {hasCategory && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Select a Service</h2>
                {services.length > 6 && (
                  <button
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {showAllServices ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View All <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {isServicesLoading
                  ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
                  : (showAllServices ? services : services.slice(0, 6)).map(
                      (service: CategoryLite) => {
                        const isActive = serviceId === service.id;
                        return (
                          <ServiceCard
                            service={service}
                            isActive={isActive}
                            onSelect={handleServiceSelect}
                            key={service.id}
                          />
                        );
                      }
                    )}
              </div>
            </div>
          )}
          {!hasCategory && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold">Search & explore services</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Select a category to see services and professionals.
              </p>
            </div>
          )}

          {hasCategory && !hasService && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold">Select a service</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Choose a service above to enable filters and view professionals.
              </p>
            </div>
          )}

          {hasService && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Available Professionals</h2>
                <button
                  onClick={handleBackToServices}
                  className="text-sm text-primary hover:underline"
                >
                  ← Back to Services
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </main>
  );
}
