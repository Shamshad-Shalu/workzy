import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Filter, SlidersHorizontal, X, MapPin } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRadius as setRadiusAction } from '@/store/slices/locationSlice';
import type { RootState } from '@/store/store';
import type { WorkerListingInfo } from '@/types/worker';

import BookingModal from '../../booking/components/bookingForm/BookingModal';
import FilterSidebar from '../components/FilterSidebar';
import { WorkerList } from '../components/WorkerList';
import { getFilterConfig } from '../helper/filterConfig';
import { useServiceDetails, useListWorkers } from '../hooks/useServices';

export default function WorkerListingPage() {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { radius, latitude, longitude, city } = useAppSelector((s: RootState) => s.location);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [availableNow, setAvailableNow] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [bookingWorker, setBookingWorker] = useState<WorkerListingInfo | null>(null);
  console.log('bookingWorker', bookingWorker);

  const { data: selectedService } = useServiceDetails(serviceId);
  useEffect(() => {
    if (selectedService) {
      const config = getFilterConfig(selectedService);
      setPriceRange([config.minPrice, config.maxPrice]);
    }
  }, [selectedService]);

  // WORKER PARAMS
  const workerParams = useMemo(
    () => ({
      page,
      limit,
      lat: latitude,
      lng: longitude,
      radiusKm: radius,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating: minRating || undefined,
      availableNow: availableNow || undefined,
    }),
    [page, limit, latitude, longitude, radius, priceRange, minRating, availableNow]
  );

  const { data: workersData, isLoading: isWorkersLoading } = useListWorkers(
    serviceId || null,
    workerParams
  );

  const priceConfig = useMemo(() => {
    return getFilterConfig(selectedService);
  }, [selectedService]);

  const handleBack = () => {
    const cid = searchParams.get('category');
    if (cid) {
      navigate(`/services?category=${cid}`);
    } else {
      navigate('/services');
    }
  };

  const resetFilters = () => {
    setMinRating(0);
    setAvailableNow(false);
    if (selectedService) {
      const config = getFilterConfig(selectedService);
      setPriceRange([config.minPrice, config.maxPrice]);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Directory</span>
            </button>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              <Filter size={14} />
              Filter
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {selectedService?.iconUrl ? (
                  <img src={selectedService.iconUrl} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <SlidersHorizontal size={24} />
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase italic leading-none">
                  {selectedService?.name || 'Listing'}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {workersData?.total || 0} EXPERTS FOUND
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <MapPin size={10} />
                    Near {city}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <FilterSidebar
                  showFilters={false}
                  setShowFilters={() => {}}
                  filterConfig={priceConfig}
                  radius={radius}
                  setRadius={val => dispatch(setRadiusAction(val))}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minRating={minRating}
                  setMinRating={setMinRating}
                  availableNow={availableNow}
                  setAvailableNow={setAvailableNow}
                  resetFilters={resetFilters}
                  isServiceSelected={!!selectedService}
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <WorkerList
              workers={workersData?.workers || []}
              isLoading={isWorkersLoading}
              total={workersData?.total || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onBook={setBookingWorker}
            />
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-card border-l border-border p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest italic">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar
                showFilters={true}
                setShowFilters={setMobileFiltersOpen}
                filterConfig={priceConfig}
                radius={radius}
                setRadius={val => dispatch(setRadiusAction(val))}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                availableNow={availableNow}
                setAvailableNow={setAvailableNow}
                resetFilters={resetFilters}
                isServiceSelected={!!selectedService}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {bookingWorker && (
        <BookingModal
          open={!!bookingWorker}
          onClose={() => setBookingWorker(null)}
          worker={bookingWorker!}
        />
      )}
    </div>
  );
}

// import { AnimatePresence, motion } from 'framer-motion';
// import { ArrowLeft, X, MapPin, Search, SlidersHorizontal } from 'lucide-react';
// import { useMemo, useState, useEffect } from 'react';
// import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { setRadius as setRadiusAction } from '@/store/slices/locationSlice';
// import type { RootState } from '@/store/store';

// import BookingModal from '../../booking/components/bookingForm/BookingModal';
// import { WorkerList } from '../components/WorkerList';
// import FilterSidebar from '../components/FilterSidebar';
// import { getFilterConfig } from '../helper/filterConfig';
// import { useServiceDetails, useListWorkers } from '../hooks/useServices';

// export default function WorkerListingPage() {
//   const { serviceId } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { radius, latitude, longitude, city } = useAppSelector((s: RootState) => s.location);

//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
//   const [minRating, setMinRating] = useState(0);
//   const [availableNow, setAvailableNow] = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [bookingWorker, setBookingWorker] = useState<any>(null);

//   const { data: selectedService } = useServiceDetails(serviceId);

//   useEffect(() => {
//     if (selectedService) {
//       const cfg = getFilterConfig(selectedService);
//       setPriceRange([cfg.minPrice, cfg.maxPrice]);
//     }
//   }, [selectedService]);

//   const workerParams = useMemo(() => ({
//     page, limit,
//     lat: latitude, lng: longitude, radiusKm: radius,
//     minPrice: priceRange[0], maxPrice: priceRange[1],
//     minRating: minRating || undefined,
//     availableNow: availableNow || undefined,
//   }), [page, latitude, longitude, radius, priceRange, minRating, availableNow]);

//   const { data: workersData, isLoading } = useListWorkers(serviceId || null, workerParams);
//   const priceConfig = useMemo(() => getFilterConfig(selectedService), [selectedService]);

//   const handleBack = () => {
//     const cid = searchParams.get('category');
//     navigate(cid ? `/services?category=${cid}` : '/services');
//   };

//   const resetFilters = () => {
//     setMinRating(0);
//     setAvailableNow(false);
//     if (selectedService) {
//       const cfg = getFilterConfig(selectedService);
//       setPriceRange([cfg.minPrice, cfg.maxPrice]);
//     }
//   };

//   const filterProps = {
//       showFilters: false,
//       setShowFilters: setMobileFiltersOpen,
//       filterConfig: priceConfig,

//       radius,
//       setRadius: (v: number) => dispatch(setRadiusAction(v)),

//       priceRange,
//       setPriceRange,

//       minRating,
//       setMinRating,

//       availableNow,
//       setAvailableNow,

//       resetFilters,
//       isServiceSelected: !!selectedService,
//     };

//   const workers = workersData?.workers || [];
//   const total = workersData?.total || 0;

//   return (
//     <div className="min-h-screen bg-background">

//       {/* ── HERO STRIP (sits right under navbar) ── */}
//       <div className="border-b border-border/60 bg-card">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5">

//           {/* Back link */}
//           <button
//             onClick={handleBack}
//             className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
//           >
//             <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
//             Back to Services
//           </button>

//           {/* Title row */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
//                 {selectedService?.name || 'Service'}
//               </h1>

//               <div className="flex items-center gap-3 mt-2">
//                 {/* Expert count badge */}
//                 <span className={`
//                   inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
//                   ${total > 0
//                     ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
//                     : 'bg-muted text-muted-foreground'
//                   }
//                 `}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${total > 0 ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
//                   {total} Expert{total !== 1 ? 's' : ''} found
//                 </span>

//                 <span className="text-border">·</span>

//                 <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
//                   <MapPin size={11} />
//                   {city}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => setMobileFiltersOpen(true)}
//               className="
//                 lg:hidden self-start sm:self-center
//                 inline-flex items-center gap-2
//                 px-4 py-2.5 rounded-xl
//                 bg-primary text-primary-foreground
//                 text-sm font-semibold
//                 hover:opacity-90 transition-opacity
//               "
//             >
//               <SlidersHorizontal size={14} />
//               Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex gap-6 items-start">
//           <FilterSidebar {...filterProps} />
//           <div className="flex-1 min-w-0">
//             {workers.length === 0 && !isLoading ? (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.25 }}
//                 className="
//                   flex flex-col items-center justify-center
//                   min-h-[400px] rounded-2xl
//                   border border-dashed border-border
//                   bg-card text-center px-8
//                 "
//               >
//                 <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
//                   <Search className="w-6 h-6 text-muted-foreground/60" />
//                 </div>
//                 <h3 className="text-base font-bold text-foreground">
//                   No professionals found
//                 </h3>
//                 <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
//                   Try expanding your radius or loosening the filters.
//                 </p>
//                 <button
//                   onClick={resetFilters}
//                   className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
//                 >
//                   Reset Filters
//                 </button>
//               </motion.div>
//             ) : (
//               <WorkerList
//                 workers={workers}
//                 isLoading={isLoading}
//                 total={total}
//                 page={page}
//                 limit={limit}
//                 onPageChange={setPage}
//                 onBook={setBookingWorker}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//      <AnimatePresence>
//     {mobileFiltersOpen && (
//           <div className="fixed inset-0 z-[100] lg:hidden">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileFiltersOpen(false)}
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             />
//             <motion.div
//               initial={{ x: '100%' }}
//               animate={{ x: 0 }}
//               exit={{ x: '100%' }}
//               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//               className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-card border-l border-border p-6 overflow-y-auto shadow-2xl"
//             >
//                 <div className="flex items-center justify-between mb-8">
//                    <h2 className="text-sm font-black uppercase tracking-widest italic">Filters</h2>
//                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
//                      <X size={20} />
//                    </button>
//                  </div>
//                  <FilterSidebar
//                    showFilters={true}
//                    setShowFilters={setMobileFiltersOpen}
//                    filterConfig={priceConfig}
//                    radius={radius}
//                    setRadius={val => dispatch(setRadiusAction(val))}
//                    priceRange={priceRange}
//                    setPriceRange={setPriceRange}
//                    minRating={minRating}
//                    setMinRating={setMinRating}
//                    availableNow={availableNow}
//                    setAvailableNow={setAvailableNow}
//                    resetFilters={resetFilters}
//                    isServiceSelected={!!selectedService}
//                  />
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//       {/* <AnimatePresence>
//         {mobileFiltersOpen && (
//           <div className="fixed inset-0 z-50 lg:hidden">
//             <motion.div
//               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setMobileFiltersOpen(false)}
//             />
//             <motion.div
//               className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
//               initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
//               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
//             >
//               <div className="flex justify-center pt-3 pb-1">
//                 <div className="w-10 h-1 rounded-full bg-border" />
//               </div>

//               <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
//                 <h2 className="text-base font-bold text-foreground">Filters</h2>
//                 <button
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto px-5 py-4">
//                 <FilterSidebar {...filterProps} />
//               </div>

//               <div className="px-5 py-4 border-t border-border/60 flex gap-3">
//                 <button
//                   onClick={resetFilters}
//                   className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
//                 >
//                   Show Results
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence> */}

//       <BookingModal
//         open={!!bookingWorker}
//         onClose={() => setBookingWorker(null)}
//         worker={bookingWorker!}
//       />
//     </div>
//   );
// }
