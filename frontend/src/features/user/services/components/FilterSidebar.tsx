import { X } from 'lucide-react';

import Button from '@/components/atoms/Button';

import type { FilterConfig } from '../helper/filterConfig';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  showFilters: boolean;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
  filterConfig: FilterConfig;
  radius: number;
  setRadius: (value: number) => void;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  minRating: number;
  setMinRating: Dispatch<SetStateAction<number>>;
  availableNow: boolean;
  setAvailableNow: Dispatch<SetStateAction<boolean>>;
  resetFilters: () => void;
  isServiceSelected: boolean;
}

export default function FilterSidebar({
  showFilters,
  setShowFilters,
  filterConfig,
  radius,
  setRadius,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  availableNow,
  setAvailableNow,
  resetFilters,
  isServiceSelected,
}: Props) {
  return (
    <aside
      className={`
        ${showFilters ? 'fixed inset-0 z-20 bg-black/50 lg:relative lg:bg-transparent' : 'hidden lg:block'}
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
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-accent rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-6">
          {filterConfig.showRadius && (
            <div>
              <label className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Radius</span>
                <span className="text-primary">{radius} km</span>
              </label>

              <input
                type="range"
                min={1}
                max={500}
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-accent rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 km</span>
                <span>500 km</span>
              </div>
            </div>
          )}

          {filterConfig.showPriceRange && (
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
                  min={filterConfig.minPrice}
                  max={filterConfig.maxPrice}
                  step={filterConfig.step}
                  value={priceRange[0]}
                  onChange={e => {
                    const newMin = Number(e.target.value);
                    setPriceRange(([, max]) => [Math.min(newMin, max), max]);
                  }}
                  className="w-full accent-primary h-2 bg-accent rounded-lg cursor-pointer"
                />

                <input
                  type="range"
                  min={filterConfig.minPrice}
                  max={filterConfig.maxPrice}
                  step={filterConfig.step}
                  value={priceRange[1]}
                  onChange={e => {
                    const newMax = Number(e.target.value);
                    setPriceRange(([min]) => [min, Math.max(newMax, min)]);
                  }}
                  className="w-full accent-primary h-2 bg-accent rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {filterConfig.showRating && (
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
          )}
          {filterConfig.showAvailableNow && (
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
          )}
          <Button
            onClick={resetFilters}
            disabled={!isServiceSelected}
            variant="secondary"
            fullWidth
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </aside>
  );
}

// import type { FilterConfig } from '../helper/filterConfig';
// import type { Dispatch, SetStateAction } from 'react';

// interface Props {
//   filterConfig: FilterConfig;
//   radius: number;
//   setRadius: (v: number) => void;
//   priceRange: [number, number];
//   setPriceRange: Dispatch<SetStateAction<[number, number]>>;
//   minRating: number;
//   setMinRating: Dispatch<SetStateAction<number>>;
//   availableNow: boolean;
//   setAvailableNow: Dispatch<SetStateAction<boolean>>;
// }

// function Section({ label }: { label: string }) {
//   return (
//     <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-3">
//       {label}
//     </p>
//   );
// }

// export default function FilterSidebar({
//   filterConfig,
//   radius, setRadius,
//   priceRange, setPriceRange,
//   minRating, setMinRating,
//   availableNow, setAvailableNow,
// }: Props) {
//   return (
//     <div className="flex flex-col gap-6 w-full">

//       {filterConfig.showRadius && (
//         <div>
//           <Section label="Search Radius" />
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-muted-foreground">Distance</span>
//             <span className="text-sm font-semibold text-foreground tabular-nums">
//               {radius} km
//             </span>
//           </div>
//           <input
//             type="range" min={1} max={500} value={radius}
//             onChange={e => setRadius(Number(e.target.value))}
//             className="w-full accent-primary cursor-pointer h-1.5 rounded-full"
//           />
//           <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
//             <span>1 km</span><span>500 km</span>
//           </div>
//         </div>
//       )}

//       {filterConfig.showPriceRange && (
//         <div>
//           <Section label="Price Range" />
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-semibold text-foreground tabular-nums">
//               ₹{priceRange[0]}
//             </span>
//             <span className="text-xs text-muted-foreground">to</span>
//             <span className="text-sm font-semibold text-foreground tabular-nums">
//               ₹{priceRange[1]}
//             </span>
//           </div>
//           <div className="flex flex-col gap-2">
//             <input
//               type="range"
//               min={filterConfig.minPrice} max={filterConfig.maxPrice} step={filterConfig.step}
//               value={priceRange[0]}
//               onChange={e => {
//                 const v = Number(e.target.value);
//                 setPriceRange(([, max]) => [Math.min(v, max), max]);
//               }}
//               className="w-full accent-primary cursor-pointer h-1.5 rounded-full"
//             />
//             <input
//               type="range"
//               min={filterConfig.minPrice} max={filterConfig.maxPrice} step={filterConfig.step}
//               value={priceRange[1]}
//               onChange={e => {
//                 const v = Number(e.target.value);
//                 setPriceRange(([min]) => [min, Math.max(v, min)]);
//               }}
//               className="w-full accent-primary cursor-pointer h-1.5 rounded-full"
//             />
//           </div>
//         </div>
//       )}

//       {filterConfig.showRating && (
//         <div>
//           <Section label="Min Rating" />
//           <div className="grid grid-cols-4 gap-2">
//             {[0, 3, 4, 4.5].map(r => (
//               <button
//                 key={r}
//                 onClick={() => setMinRating(r)}
//                 className={`
//                   py-2 rounded-lg text-xs font-semibold border transition-all duration-150
//                   ${minRating === r
//                     ? 'bg-primary text-primary-foreground border-primary shadow-sm'
//                     : 'bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
//                   }
//                 `}
//               >
//                 {r === 0 ? 'Any' : `${r}+`}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {filterConfig.showAvailableNow && (
//         <div>
//           <Section label="Availability" />
//           <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all">
//             <input
//               type="checkbox" checked={availableNow}
//               onChange={e => setAvailableNow(e.target.checked)}
//               className="w-4 h-4 accent-primary cursor-pointer shrink-0"
//             />
//             <div>
//               <p className="text-sm font-medium text-foreground leading-none">Available Now</p>
//               <p className="text-xs text-muted-foreground mt-0.5">Only show available pros</p>
//             </div>
//           </label>
//         </div>
//       )}
//     </div>
//   );
// }
