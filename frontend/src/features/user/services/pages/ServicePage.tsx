import {
  SlidersHorizontal,
  Star,
  Clock,
  User,
  Briefcase,
  X,
  MapPin,
  Wrench,
  Droplet,
  Zap,
  Wind,
  Hammer,
  Settings,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';

// Service Icon Mapping
const SERVICE_ICONS = {
  'fix-water-leak': Droplet,
  'install-tap': Wrench,
  'toilet-repair': Settings,
  'drain-cleaning': Wind,
  'pipe-installation': Hammer,
  'water-heater': Zap,
} as const;

// Types
interface Service {
  id: string;
  name: string;
  category: string;
  icon?: keyof typeof SERVICE_ICONS;
}

interface Worker {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  experience: number;
  price: number;
  distance: number;
  available: boolean;
  image: string;
  completedJobs: number;
  isSponsored?: boolean;
}

// Dummy Data - Replace with API calls
const DUMMY_SERVICES: Service[] = [
  { id: 'fix-water-leak', name: 'Fix Water Leak', category: 'plumber', icon: 'fix-water-leak' },
  { id: 'install-tap', name: 'Install Tap/Faucet', category: 'plumber', icon: 'install-tap' },
  { id: 'toilet-repair', name: 'Toilet Repair', category: 'plumber', icon: 'toilet-repair' },
  { id: 'drain-cleaning', name: 'Drain Cleaning', category: 'plumber', icon: 'drain-cleaning' },
  {
    id: 'pipe-installation',
    name: 'Pipe Installation',
    category: 'plumber',
    icon: 'pipe-installation',
  },
  { id: 'water-heater', name: 'Water Heater Repair', category: 'plumber', icon: 'water-heater' },
];

const DUMMY_WORKERS: Worker[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rating: 4.8,
    reviews: 245,
    experience: 8,
    price: 299,
    distance: 2.3,
    available: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    completedJobs: 1200,
    isSponsored: true,
  },
  {
    id: 2,
    name: 'Amit Sharma',
    rating: 4.9,
    reviews: 189,
    experience: 6,
    price: 349,
    distance: 3.1,
    available: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    completedJobs: 980,
  },
  {
    id: 3,
    name: 'Suresh Patel',
    rating: 4.7,
    reviews: 156,
    experience: 5,
    price: 279,
    distance: 1.8,
    available: false,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
    completedJobs: 750,
  },
  {
    id: 4,
    name: 'Vijay Singh',
    rating: 4.6,
    reviews: 134,
    experience: 7,
    price: 319,
    distance: 4.2,
    available: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
    completedJobs: 890,
  },
  {
    id: 5,
    name: 'Mohan Reddy',
    rating: 4.8,
    reviews: 201,
    experience: 9,
    price: 399,
    distance: 2.9,
    available: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohan',
    completedJobs: 1450,
    isSponsored: true,
  },
  {
    id: 6,
    name: 'Ravi Verma',
    rating: 4.5,
    reviews: 98,
    experience: 4,
    price: 259,
    distance: 5.1,
    available: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
    completedJobs: 560,
  },
];

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get location from Redux
  const { city, latitude, longitude, radius: globalRadius } = useAppSelector(s => s.location);

  // Get URL params
  const category = searchParams.get('category') || 'plumber';
  const selectedService = searchParams.get('service');
  const pageParam = searchParams.get('page') || '1';

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [radius, setRadius] = useState(globalRadius);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [availableNow, setAvailableNow] = useState(false);

  // Pagination
  const currentPage = parseInt(pageParam);
  const itemsPerPage = 6;

  // Update URL when service is selected
  const handleServiceSelect = (serviceId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('service', serviceId);
    newParams.delete('page'); // Reset to page 1
    setSearchParams(newParams);
    setShowAllServices(false);
  };

  // Clear service selection
  const handleClearService = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('service');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Update page in URL
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter workers
  const filteredWorkers = DUMMY_WORKERS.filter(worker => {
    if (availableNow && !worker.available) {
      return false;
    }
    if (worker.rating < minRating) {
      return false;
    }
    if (worker.experience < minExperience) {
      return false;
    }
    if (worker.price < priceRange[0] || worker.price > priceRange[1]) {
      return false;
    }
    if (worker.distance > radius) {
      return false;
    }
    return true;
  });

  // Sort: sponsored first, then by rating
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) {
      return -1;
    }
    if (!a.isSponsored && b.isSponsored) {
      return 1;
    }
    return b.rating - a.rating;
  });

  const paginatedWorkers = sortedWorkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);

  const resetFilters = () => {
    setRadius(globalRadius);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setMinExperience(0);
    setAvailableNow(false);
  };

  const displayServices = showAllServices ? DUMMY_SERVICES : DUMMY_SERVICES.slice(0, 6);

  return (
    <div className="min-h-screen section-container py-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters {sortedWorkers.length !== DUMMY_WORKERS.length && `(${sortedWorkers.length})`}
      </button>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`
            ${showFilters ? 'fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
            lg:w-80 flex-shrink-0
          `}
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowFilters(false);
            }
          }}
        >
          <div
            className={`
              ${showFilters ? 'absolute right-0 top-0 h-full w-80 bg-background overflow-y-auto' : ''}
              lg:sticky lg:top-20 bg-card border border-border rounded-lg p-6 shadow-sm
            `}
          >
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-accent/50 border border-border rounded-lg">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{city}</span>
                </div>
              </div>

              {/* Radius */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Radius</span>
                  <span className="text-primary">{radius} km</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radius}
                  onChange={e => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Price Range</span>
                  <span className="text-primary">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </span>
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`px-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                        minRating === rating
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                          : 'bg-background border-border hover:border-primary hover:bg-accent'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Experience</span>
                  <span className="text-primary">{minExperience}+ yrs</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={minExperience}
                  onChange={e => setMinExperience(Number(e.target.value))}
                  className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Any</span>
                  <span>10+ years</span>
                </div>
              </div>

              {/* Available Now */}
              <label className="flex items-center gap-3 p-3 bg-accent/30 hover:bg-accent/50 border border-border rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={availableNow}
                  onChange={e => setAvailableNow(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Available Now</div>
                  <div className="text-xs text-muted-foreground">
                    Show only available professionals
                  </div>
                </div>
              </label>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2.5 bg-accent hover:bg-accent/80 rounded-lg text-sm font-medium transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Service Selection Grid */}
          {!selectedService && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Select a Service</h2>
                {DUMMY_SERVICES.length > 6 && (
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
                {displayServices.map(service => {
                  const Icon = service.icon ? SERVICE_ICONS[service.icon] : Wrench;
                  const isActive = selectedService === service.id;

                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className={`group relative bg-card border rounded-lg p-4 hover:shadow-md transition-all ${
                        isActive
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div
                          className={`p-3 rounded-full transition-colors ${
                            isActive ? 'bg-primary/10' : 'bg-accent group-hover:bg-primary/10'
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-primary'
                            }`}
                          />
                        </div>
                        <h3
                          className={`text-xs sm:text-sm font-medium leading-tight transition-colors ${
                            isActive ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {service.name}
                        </h3>
                      </div>
                      {isActive && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Workers Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                {selectedService ? 'Available Professionals' : 'All Professionals'}
              </h2>
              {selectedService && (
                <button
                  onClick={handleClearService}
                  className="text-sm text-primary hover:underline"
                >
                  ← Back to Services
                </button>
              )}
            </div>

            {/* Workers List */}
            <div className="space-y-3 sm:space-y-4">
              {paginatedWorkers.map(worker => (
                <div
                  key={worker.id}
                  className="relative bg-card border border-border rounded-lg p-4 sm:p-5 hover:shadow-md transition-all hover:border-primary/50"
                >
                  {/* Sponsored Badge */}
                  {worker.isSponsored && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Sponsored
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Worker Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        src={worker.image}
                        alt={worker.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-border"
                      />
                    </div>

                    {/* Worker Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{worker.name}</h3>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-foreground">{worker.rating}</span>
                              <span className="text-xs">({worker.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{worker.experience} yrs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{worker.distance} km</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-2xl font-bold text-primary">₹{worker.price}</div>
                          <div className="text-xs text-muted-foreground">per service</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{worker.completedJobs} jobs</span>
                        </div>
                        {worker.available && (
                          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Available Now</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/booking?worker=${worker.id}&service=${selectedService || category}`
                          )
                        }
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all ${
                          worker.available
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!worker.available}
                      >
                        {worker.available ? 'Book Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition-colors text-sm font-medium"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-card border border-border hover:bg-accent'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition-colors text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}

            {/* No Results */}
            {sortedWorkers.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Try adjusting your filters or search in a wider area
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* </div> */}
    </div>
  );

  return <section className="min-h-screen"></section>;
}
