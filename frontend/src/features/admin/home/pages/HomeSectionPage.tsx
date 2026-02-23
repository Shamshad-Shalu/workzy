import { Filter, Layers } from 'lucide-react';
import { useCallback, useState } from 'react';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import { DataList } from '@/components/data-table/DataList';
import { AppModal } from '@/components/molecules/AppModal';
import SearchInput from '@/components/molecules/SearchInput';
import { HomeSectionsFilterOptions } from '@/constants';
import { useUrlFilterParams } from '@/hooks/useUrlFilterParams';
import type { AdminHomeSection, HomeSection, ListType } from '@/types/admin/home';

import HomeSectionCard from '../components/HomeSectionCard';
import SectionDetailView from '../components/SectionDetailView';
import { useHomeLayout } from '../hooks/useHomeLayout';
import { useHomeSections } from '../hooks/useHomeSection';

type CustomParams = { type: ListType };
export default function HomeSectionPage() {
  const [selectedSection, setSelectedSection] = useState<AdminHomeSection | null>(null);
  const [statusSection, setStatusSection] = useState<AdminHomeSection | null>(null);
  const [_addModalOpen, setAddModalOpen] = useState(false);

  const { pageIndex, pageSize, search, status, updateParams, type } =
    useUrlFilterParams<CustomParams>([{ key: 'type' }]);
  const {
    sectionData,
    sectionsError,
    sectionsIsLoading,
    // updateSection,
    // addSection,
    updateSectionStatus,
  } = useHomeSections({ pageIndex, pageSize, search, status, type });
  const { layout } = useHomeLayout();

  const handleSectionSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0 });
    },
    [updateParams]
  );
  return (
    <main>
      <div className="flex justify-end -mt-6">
        <Button
          variant="blue"
          disabled={!!sectionsError}
          size="lg"
          onClick={() => setAddModalOpen(true)}
          iconLeft={<Layers />}
        >
          Add Section
        </Button>
      </div>
      <div className="bg-card border rounded-xl p-6 pb-0 mt-6">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <SearchInput
              placeholder="Search by name"
              value={search}
              onChange={handleSectionSearchChange}
            />
          </div>
          <div className="sm:col-span-3">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'inactive' },
              ]}
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              placeholder="All Types"
              value={type}
              onChange={v => updateParams({ type: v, page: 0 })}
              leftIcon={<Filter />}
              options={HomeSectionsFilterOptions}
            />
          </div>
        </div>
      </div>
      <section className="@container pt-9">
        <DataList<HomeSection>
          mode="card"
          data={sectionData?.sections ?? []}
          total={sectionData?.total ?? 0}
          isLoading={sectionsIsLoading}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={Math.ceil((sectionData?.total ?? 0) / pageSize) || 1}
          onPageChange={p => updateParams({ page: p })}
          onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
          emptyText="No sections found"
          gridClassName="grid gap-5 grid-cols-1 @[480px]:grid-cols-2 @[800px]:grid-cols-3 @[1220px]:grid-cols-4"
          renderCard={section => (
            <HomeSectionCard
              section={section}
              onExpand={setSelectedSection}
              onStatusToggle={setStatusSection}
              isLayoutSection={layout?.sections.some(s => s.sectionId === section.id)}
            />
          )}
        />
      </section>

      <AppModal
        open={!!selectedSection}
        className="sm:max-w-4xl w-full"
        isTitleHidden={false}
        title={selectedSection?.name ?? 'Section Preview'}
        onClose={() => setSelectedSection(null)}
      >
        {selectedSection && <SectionDetailView section={selectedSection} onEdit={() => {}} />}
      </AppModal>

      <AppModal
        open={!!statusSection}
        onClose={() => setStatusSection(null)}
        isTitleHidden={true}
        confirmText={statusSection?.isActive ? 'Block' : 'Unblock'}
        onConfirm={() => {
          if (!statusSection?.id) {
            return;
          }
          updateSectionStatus.mutate(statusSection.id);
          setStatusSection(null);
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {statusSection?.isActive ? 'Block' : 'Unblock'}{' '}
          <b>{statusSection?.name}</b>
        </span>
      </AppModal>
    </main>
  );
}
