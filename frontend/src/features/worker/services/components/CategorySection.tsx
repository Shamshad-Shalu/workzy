import { Info, Loader2, Zap } from 'lucide-react';

import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import type { Category } from '@/types/category';
import type { Service } from '@/types/service';

type OptionType = {
  label: string;
  value: string;
};
interface CategoryLevelsHook {
  state: {
    level1Id: string;
    level2Id: string;
  };
  handlers: {
    handleL1Change: (val: string) => void;
    handleL2Change: (val: string) => void;
    resetLevels: () => void;
  };
  options: {
    l1Options: OptionType[];
    l2Options: OptionType[];
  };
  loading: {
    isL2Loading: boolean;
    isDetailsLoading: boolean;
  };
  category: Category | undefined;
}
interface CategorySectionProps {
  categoryInfo: CategoryLevelsHook;
  service?: Service | null;
}

export function CategorySection({ categoryInfo, service }: CategorySectionProps) {
  const { level1Id, level2Id } = categoryInfo.state;
  const { handleL1Change, handleL2Change } = categoryInfo.handlers;
  const { isL2Loading, isDetailsLoading } = categoryInfo.loading;
  const { l1Options, l2Options } = categoryInfo.options;
  const { category } = categoryInfo;

  return (
    <div className="bg-section-blue border border-section-blue-border rounded-xl p-5">
      {!service ? (
        <>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Select Service Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <Label>Main Category</Label>
              <Select
                value={level1Id}
                onChange={handleL1Change}
                options={l1Options}
                placeholder="Select Level 1"
              />
            </div>

            <div>
              <Label className="flex justify-between">
                Service {isL2Loading && <Loader2 className="w-3 h-3 animate-spin" />}
              </Label>
              <Select
                value={level2Id}
                onChange={handleL2Change}
                options={l2Options}
                disabled={!level1Id || l2Options.length === 0}
                placeholder={level1Id ? 'Select Level 2' : 'Select Main first'}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="py-4">
          <h3>ServiceType : {service?.serviceName}</h3>
        </div>
      )}

      {category && (
        <div
          className={`bg-background/50 rounded-lg p-4 space-y-2 transition-opacity ${isDetailsLoading ? 'opacity-50' : 'opacity-100'}`}
        >
          <div className="flex items-center gap-2 text-xs">
            <Info className="w-4 h-4 text-fine-blue" />
            <span className="font-medium">Category Details</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium">{category.serviceType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Pricing:</span>
              <p className="font-medium capitalize">{category.pricingMode?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Base Rate:</span>
              <p className="font-medium">₹{category.baseRate}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Travel/km:</span>
              <p className="font-medium">₹{category.travelRatePerKM}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
