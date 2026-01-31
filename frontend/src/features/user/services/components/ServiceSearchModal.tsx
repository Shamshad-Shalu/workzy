import type { CategorySuggestion } from '@/types/category';
import { Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SearchInput from '@/components/molecules/SearchInput';
import ServiceSkeleton from './ServiceSkeleton';
import TrendingSkeleton from './TrendingSkeleton';

interface ServiceSearchModalProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
  searchQuery: string;
  internalSearchQuery: string;
  setInternalSearchQuery: (v: string) => void;

  categoryServices: CategorySuggestion[];
  trending: CategorySuggestion[];

  isSearching: boolean;
  isTrendingLoading: boolean;

  onSelectService: (service: CategorySuggestion) => void;
}

export default function ServiceSearchModal({
  open,
  onClose,
  isMobile,
  searchQuery,
  internalSearchQuery,
  setInternalSearchQuery,
  categoryServices,
  trending,
  isSearching,
  isTrendingLoading,
  onSelectService,
}: ServiceSearchModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile || !open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, isMobile, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const hasResults = categoryServices.length > 0;

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed top-[72px] left-0 right-0 z-50 flex justify-center px-4">
          <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <SearchInput
                  value={internalSearchQuery}
                  variant="inline"
                  onChange={setInternalSearchQuery}
                  autoFocus
                  placeholder="Search for services"
                  className="w-full pl-9 pr-3 py-2 bg-accent border border-border rounded-r-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
                />
              </div>
            </div>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
              {searchQuery.trim() ? (
                <>
                  {isSearching && <ServiceSkeleton />}
                  {hasResults ? (
                    <div className="divide-y divide-border">
                      {categoryServices.map(service => (
                        <button
                          key={service.id}
                          onClick={() => onSelectService(service)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={service.iconUrl}
                              alt={service.name}
                              className="w-full h-full object-cover"
                              onError={e => {
                                (e.target as HTMLImageElement).src =
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    service.name
                                  )}&background=random`;
                              }}
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{service.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6">
                      {!isSearching && (
                        <div className="text-center mb-6">
                          <div className="text-4xl mb-3">🔍</div>
                          <p className="text-sm text-muted-foreground">
                            No services found matching "{searchQuery}"
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Try searching with different keywords
                          </p>
                        </div>
                      )}

                      <div className="border-t border-border pt-4">
                        <h3 className="text-xs font-semibold text-muted-foreground mb-3">
                          TRENDING SEARCHES
                        </h3>
                        <div className="space-y-1">
                          {isTrendingLoading && <TrendingSkeleton />}
                          {trending.slice(0, 5).map(service => (
                            <button
                              key={service.id}
                              onClick={() => onSelectService(service)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                            >
                              <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{service.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Trending searches</h3>
                    <div className="space-y-1">
                      {trending.map(service => (
                        <button
                          key={service.id}
                          onClick={() => onSelectService(service)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                        >
                          <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{service.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-[72px] left-0 right-0 z-50 flex justify-center px-4">
        <div
          ref={dropdownRef}
          className="w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200"
        >
          {searchQuery.trim() ? (
            <>
              {/* Search Results */}
              <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                {isSearching && <ServiceSkeleton />}

                {hasResults ? (
                  <div className="divide-y divide-border">
                    {categoryServices.map(service => (
                      <button
                        key={service.id}
                        onClick={() => onSelectService(service)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={service.iconUrl}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  service.name
                                )}&background=random`;
                            }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{service.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6">
                    {!isSearching && (
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-sm text-muted-foreground">
                          No services found matching "{searchQuery}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                    <div className="border-t border-border pt-4">
                      <h3 className="text-xs font-semibold text-muted-foreground mb-3">
                        TRENDING SEARCHES
                      </h3>
                      <div className="space-y-1">
                        {isTrendingLoading && <TrendingSkeleton />}
                        {trending.slice(0, 5).map(service => (
                          <button
                            key={service.id}
                            onClick={() => onSelectService(service)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{service.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Trending searches</h3>
                  <div className="space-y-1">
                    {isTrendingLoading && <TrendingSkeleton />}
                    {trending.map(service => (
                      <button
                        key={service.id}
                        onClick={() => onSelectService(service)}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                      >
                        <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{service.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
