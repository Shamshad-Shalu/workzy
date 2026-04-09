import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { cn } from '@/lib/utils';
import CategoryService from '@/services/category.service';

import { ServiceCard } from '../../home/components/ServiceCard';
import { ServiceGridSkeleton } from '../components/ServiceCardSkeleton';
import { usePublicServices } from '../hooks/useServices';

export default function ServiceDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryId = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'popular';

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories-level-1'],
    queryFn: () => CategoryService.getCategoryLevels(1),
    staleTime: 60 * 60 * 1000,
  });

  const updateParam = (key: string, value: string) => {
    setSearchParams(prev => {
      if (!value) {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const {
    data,
    isLoading: isInitialLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: loadingMore,
  } = usePublicServices({
    categoryId: activeCategoryId || undefined,
    sortBy: sortBy,
    limit: 8,
  });

  const services = data?.pages.flatMap(page => page.categories) ?? [];

  return (
    <div className="min-h-screen flex flex-col pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div />
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-48 group">
                <select
                  value={sortBy}
                  onChange={e => updateParam('sortBy', e.target.value)}
                  className="w-full appearance-none bg-card h-10 pl-4 pr-10 rounded-xl border border-border shadow-sm text-sm font-medium text-foreground cursor-pointer outline-none transition-all hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  <option value="popular">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {(activeCategoryId || sortBy !== 'popular') && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="w-full overflow-hidden border-b border-border/60 pb-1">
            <div className="flex gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x scroll-pl-1">
              <button
                onClick={() => updateParam('category', '')}
                className={cn(
                  'whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 snap-start select-none border',

                  !activeCategoryId
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:bg-muted hover:text-foreground'
                )}
              >
                All Services
              </button>
              {loadingCategories ? (
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-muted rounded-full animate-pulse" />
                  ))}
                </div>
              ) : (
                categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.id)}
                    className={cn(
                      'whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 snap-start select-none border',

                      activeCategoryId === cat.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:border-border/80 hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {isInitialLoading && services.length === 0 ? (
            <ServiceGridSkeleton />
          ) : services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm mx-auto max-w-lg"
            >
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No services found</h3>
              <p className="text-muted-foreground mt-2 px-6">
                We couldn't find anything matching your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-6 text-primary font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                {services.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(i * 0.05, 0.4),
                      ease: 'easeOut',
                    }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>
              {hasNextPage && !loadingMore && (
                <div className="flex justify-center pb-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={loadingMore}
                    className="group flex items-center gap-2 bg-card border border-border text-foreground px-8 py-3 rounded-full font-semibold shadow-sm hover:shadow-md hover:border-primary/20 hover:text-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {' '}
                    Show More Services
                  </button>
                </div>
              )}
              {loadingMore && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ServiceGridSkeleton count={6} />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
