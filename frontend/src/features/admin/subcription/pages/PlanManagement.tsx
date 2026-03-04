import { Filter, Layers } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import SearchInput from '@/components/molecules/SearchInput';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import type { Plan } from '@/types/plan';

import PlanCard from '../components/PlanCard';
import PlanModal from '../components/PlanModal';
import { usePlans } from '../hooks/usePlans';

import type { PlanFormData } from '../validation/plan-schema';

export default function PlanManagementPage() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const { pageIndex, pageSize, search, status, updateParams } = useUrlFilterParams();

  const { planData, planError, isLoading, addPlan, updatePlan } = usePlans({
    pageIndex,
    pageSize,
    search,
    status,
  });

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0 });
    },
    [updateParams]
  );

  const handleClosePlanModal = () => {
    setEditingPlan(null);
    setPlanModalOpen(false);
  };

  const handlePlanSubmit = async (planData: PlanFormData) => {
    if (editingPlan) {
      await updatePlan.mutateAsync({
        planId: editingPlan.id,
        data: planData,
      });
    } else {
      await addPlan.mutateAsync(planData);
    }
  };

  const onEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanModalOpen(true);
  };

  return (
    <main>
      <div className="flex justify-end -mt-6">
        <Button
          variant="blue"
          disabled={!!planError}
          size="lg"
          onClick={() => setPlanModalOpen(true)}
          iconLeft={<Layers />}
        >
          Add Plan
        </Button>
      </div>
      <div className="bg-card border rounded-xl p-6 pb-0 mt-6">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <SearchInput
              placeholder="Search by name"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-5">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>
        </div>
      </div>
      <section className="@container pt-9">
        <DataList<Plan>
          mode="card"
          data={planData?.plans ?? []}
          total={planData?.total ?? 0}
          isLoading={isLoading}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil((planData?.total ?? 0) / pageSize) || 1}
          onPageChange={p => updateParams({ page: p })}
          onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
          emptyText="No sections found"
          gridClassName="grid gap-5 grid-cols-1 @[480px]:grid-cols-2 @[800px]:grid-cols-3 @[1220px]:grid-cols-4"
          renderCard={plan => <PlanCard plan={plan} onEdit={onEdit} />}
        />
      </section>

      <PlanModal
        open={planModalOpen}
        onClose={handleClosePlanModal}
        onSubmit={handlePlanSubmit}
        plan={editingPlan}
      />
    </main>
  );
}
