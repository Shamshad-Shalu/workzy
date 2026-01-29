const DUMMY_DATA: CategorySuggestions = {
  services: [
    {
      id: '1',
      name: 'Electrician',
      iconUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumber',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC Repair & Service',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC Rsdfdsepair & Service',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC Rsdfdsepair & Service',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC Rsdfdsepair & Service',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbedsfsdfsdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC Rsdfdsepair & Service',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '2',
      name: 'Plumbesdfdsr',
      iconUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '3',
      name: 'AC sdfdase',
      iconUrl: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '4',
      name: 'Carpenter',
      iconUrl: 'https://images.unsplash.com/photo-1632778379926-89b2b7ca3c00?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '5',
      name: 'House Cleaning',
      iconUrl: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '6',
      name: 'Salon for Women',
      iconUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '7',
      name: 'Painter',
      iconUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&h=100&fit=crop',
      level: 1,
    },
    {
      id: '8',
      name: 'Pest Control',
      iconUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100&h=100&fit=crop',
      level: 1,
    },
  ],
  suggestions: [
    { id: 's1', name: 'Professional cleaning', iconUrl: '', level: 2 },
    { id: 's2', name: 'Salon', iconUrl: '', level: 2 },
    { id: 's3', name: 'Carpenters', iconUrl: '', level: 2 },
    { id: 's4', name: 'Electricians', iconUrl: '', level: 2 },
    { id: 's5', name: 'Ro repair', iconUrl: '', level: 2 },
    { id: 's6', name: 'Washing machine repair', iconUrl: '', level: 2 },
    { id: 's7', name: 'Refrigerator repair', iconUrl: '', level: 2 },
    { id: 's7', name: 'Refrigerator repair', iconUrl: '', level: 2 },
    { id: 's7', name: 'Refrigerator repair', iconUrl: '', level: 2 },
    { id: 's7', name: 'Refrigerator repair', iconUrl: '', level: 2 },
    { id: 's8', name: 'Microwave repair', iconUrl: '', level: 2 },
  ],
};


import { useRef, useEffect, useState } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import SearchInput from './SearchInput';

interface CategorySuggestion {
  id: string;
  name: string;
  iconUrl: string;
  level: number;
}

interface CategorySuggestions {
  services: CategorySuggestion[];
  suggestions: CategorySuggestion[];
}

interface ServiceSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectService: (service: CategorySuggestion) => void;
  triggerRef?: React.RefObject<HTMLDivElement | null>;
  externalSearchQuery?: string;
}

export function ServiceSelectionModal({
  open,
  onClose,
  onSelectService,
  triggerRef,
  externalSearchQuery = '',
}: ServiceSelectionModalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const searchQuery = isMobile ? internalSearchQuery : externalSearchQuery;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!open) {
      setInternalSearchQuery('');
    }
  }, [open]);

  const filteredServices = searchQuery.trim()
    ? DUMMY_DATA.services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasResults = filteredServices.length > 0;

  const handleSelectService = (service: CategorySuggestion) => {
    onSelectService(service);
    onClose();
    setInternalSearchQuery('');
  };

  useEffect(() => {
    if (isMobile) {return;}

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, onClose, triggerRef, isMobile]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [open, onClose]);

  if (!open) {return null;}

  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="fixed top-[72px] left-0 right-0 z-50 flex justify-center px-4">
          <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Mobile Header with Close Button and Search */}
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
                  {hasResults ? (
                    <div className="divide-y divide-border">
                      {filteredServices.map(service => (
                        <button
                          key={service.id}
                          onClick={() => handleSelectService(service)}
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
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-sm text-muted-foreground">
                          No services found matching "{searchQuery}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try searching with different keywords
                        </p>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h3 className="text-xs font-semibold text-muted-foreground mb-3">
                          TRENDING SEARCHES
                        </h3>
                        <div className="space-y-1">
                          {DUMMY_DATA.suggestions.slice(0, 5).map(suggestion => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSelectService(suggestion)}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                            >
                              <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{suggestion.name}</span>
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
                      {DUMMY_DATA.suggestions.map(suggestion => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSelectService(suggestion)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                        >
                          <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{suggestion.name}</span>
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
                {hasResults ? (
                  <div className="divide-y divide-border">
                    {filteredServices.map(service => (
                      <button
                        key={service.id}
                        onClick={() => handleSelectService(service)}
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
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">🔍</div>
                      <p className="text-sm text-muted-foreground">
                        No services found matching "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try searching with different keywords
                      </p>
                    </div>

                    <div className="border-t border-border pt-4">
                      <h3 className="text-xs font-semibold text-muted-foreground mb-3">
                        TRENDING SEARCHES
                      </h3>
                      <div className="space-y-1">
                        {DUMMY_DATA.suggestions.slice(0, 5).map(suggestion => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSelectService(suggestion)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">{suggestion.name}</span>
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
                    {DUMMY_DATA.suggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSelectService(suggestion)}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-lg transition-colors text-left"
                      >
                        <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{suggestion.name}</span>
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
