import {
  AlertCircle,
  Filter,
  GripVertical,
  LayoutDashboard,
  Pencil,
  RotateCcw,
  Save,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import SearchInput from '@/components/molecules/SearchInput';
import { Skeleton } from '@/components/ui/skeleton';
import {
  HOME_SECTION_TYPE_LABELS,
  HomeSectionsFilterOptions,
  type HomeSectionType,
} from '@/constants';
import { cn } from '@/lib/utils';
import type { AdminHomeSection, ListType, SectionListItem } from '@/types/admin/home';

import { useHomeLayout } from '../hooks/useHomeLayout';
import { useHomeSections } from '../hooks/useHomeSection';
import { saveLayoutSchema } from '../validation/layout-schema';

export default function HomeLayoutPage() {
  const { layout, layoutError, layoutIsLoading, updateLayout } = useHomeLayout();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [layoutItems, setLayoutItems] = useState<SectionListItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dragIndex = useRef<number | null>(null);

  const buildInitialItems = useCallback((): SectionListItem[] => {
    return (layout?.sections ?? []).map((s, i) => ({
      sectionId: s.sectionId,
      sectionName: s.sectionName,
      sectionType: s.sectionType,
      order: i + 1,
    }));
  }, [layout]);

  useEffect(() => {
    if (!isEditMode) {
      setLayoutItems(buildInitialItems());
    }
  }, [buildInitialItems, isEditMode]);

  const layoutIds = useMemo(() => new Set(layoutItems.map(i => i.sectionId)), [layoutItems]);

  const handleLayoutUpdate = async () => {
    const result = saveLayoutSchema.safeParse({ items: layoutItems });
    if (!result.success) {
      setValidationErrors(result.error.issues.map(i => i.message));
      return;
    }
    setValidationErrors([]);

    const payload = result.data.items.map(item => ({
      sectionId: item.sectionId,
      order: item.order,
    }));

    try {
      const data = await updateLayout.mutateAsync(payload);
      toast.success(data.message);
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const resetLayout = useCallback(() => {
    setIsEditMode(false);
    setLayoutItems(buildInitialItems());
    setValidationErrors([]);
  }, [buildInitialItems]);

  const removeSection = useCallback((sectionId: string) => {
    setLayoutItems(prev =>
      prev.filter(i => i.sectionId !== sectionId).map((item, idx) => ({ ...item, order: idx + 1 }))
    );
    setValidationErrors([]);
  }, []);

  const addSection = useCallback((section: AdminHomeSection) => {
    setLayoutItems(prev => [
      ...prev,
      {
        sectionId: section.id,
        sectionName: section.name,
        sectionType: section.type as HomeSectionType,
        order: prev.length + 1,
      },
    ]);
    setValidationErrors([]);
  }, []);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const isDirty =
    JSON.stringify(layoutItems.map(i => i.sectionId)) !==
    JSON.stringify((layout?.sections ?? []).map(s => s.sectionId));

  const handleDragEnter = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) {
      return;
    }
    setLayoutItems(prev => {
      const next = [...prev];
      const [dragged] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, dragged);
      dragIndex.current = index;
      return next.map((item, i) => ({ ...item, order: i + 1 }));
    });
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
  };

  return (
    <main>
      <div className="flex justify-end -mt-6 gap-2 shrink-0">
        {!isEditMode ? (
          <Button
            iconRight={<Pencil size={18} />}
            variant="blue"
            onClick={() => setIsEditMode(true)}
          >
            Edit Layout
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              iconLeft={<RotateCcw className="size-3.5" />}
              onClick={resetLayout}
            >
              Reset
            </Button>
            <Button
              variant="green"
              onClick={handleLayoutUpdate}
              loading={updateLayout.isPending}
              disabled={!isDirty || updateLayout.isPending}
              iconLeft={<Save className="size-3.5" />}
            >
              Save Layout
            </Button>
          </div>
        )}
      </div>
      {validationErrors.length > 0 && (
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex flex-col gap-1">
          {validationErrors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-12">
        <div
          className={cn(
            'rounded-2xl border bg-card p-4',
            isEditMode ? 'md:col-span-7' : 'md:col-span-12'
          )}
        >
          {isEditMode && (
            <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">
              {layoutItems?.length
                ? `${layoutItems.length} section(s) · drag to reorder`
                : 'Empty layout'}
            </p>
          )}
          <div className="flex flex-col gap-2 min-h-[240px] max-h-[500px] overflow-y-auto">
            {layoutIsLoading && Array.from({ length: 5 }).map((_, i) => <LayoutSkeleton key={i} />)}
            {layoutError && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <LayoutDashboard className="size-10 opacity-30" />
                <p className="text-sm">Failed to load layout data.</p>
              </div>
            )}
            {!layoutIsLoading && !layoutError && layoutItems?.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Layout is empty. Add sections from the left.
              </div>
            ) : (
              layoutItems?.map((item, i) => (
                <LayoutSection
                  item={item}
                  isEditMode={isEditMode}
                  removeSection={removeSection}
                  key={i}
                  index={i}
                  handleDragStart={handleDragStart}
                  handleDragEnter={handleDragEnter}
                  handleDragEnd={handleDragEnd}
                />
              ))
            )}
          </div>
        </div>
        {isEditMode && (
          <div className="rounded-2xl border bg-card p-4 md:col-span-5">
            <SectionOptions layoutIds={layoutIds} onAdd={addSection} />
          </div>
        )}
      </div>
    </main>
  );
}

function LayoutSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border bg-background">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>

      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  );
}

interface LayoutSectionProps {
  item: SectionListItem;
  index: number;
  isEditMode: boolean;
  removeSection: (sectionId: string) => void;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
}

function LayoutSection({
  item,
  index,
  isEditMode = false,
  removeSection,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: LayoutSectionProps) {
  return (
    <div
      draggable={isEditMode}
      onDragStart={() => handleDragStart(index)}
      onDragEnter={() => handleDragEnter(index)}
      onDragEnd={handleDragEnd}
      onDragOver={e => e.preventDefault()}
      className={cn(
        'flex items-center justify-between gap-2 px-3 py-2 rounded-xl border bg-background',
        isEditMode && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="min-w-0 flex items-center gap-2">
        <GripVertical
          className={cn(
            'size-4 shrink-0 transition-colors',
            isEditMode ? 'text-muted-foreground' : 'text-muted-foreground/30'
          )}
        />
        <span className="size-6 rounded-md bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <div>
          <div className="text-sm font-medium truncate">{item.sectionName}</div>
          <div className="text-[11px] text-muted-foreground">
            {HOME_SECTION_TYPE_LABELS[item.sectionType] ?? item.sectionType}
          </div>
        </div>
      </div>

      {isEditMode && (
        <Button variant="outline" size="sm" onClick={() => removeSection(item.sectionId)}>
          Remove
        </Button>
      )}
    </div>
  );
}

interface SectionOptionProps {
  onAdd: (selection: AdminHomeSection) => void;
  layoutIds: Set<string>;
}
export function SectionOptions({ onAdd, layoutIds }: SectionOptionProps) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ListType>('all');
  const [pageIndex, setPageIndex] = useState(0);

  const { sectionData, sectionsIsLoading, sectionsError } = useHomeSections({
    pageIndex,
    pageSize: 5,
    search,
    status: 'active',
    type,
  });

  const total = sectionData?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / 5));

  useEffect(() => {
    setPageIndex(prev => Math.max(0, Math.min(pageCount - 1, prev)));
  }, [pageCount]);

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPageIndex(0);
  }, []);

  const handleType = useCallback((v: string) => {
    setType(v as ListType);
    setPageIndex(0);
  }, []);

  const handlePageChange = useCallback(
    (next: number) => {
      setPageIndex(Math.max(0, Math.min(pageCount - 1, next)));
    },
    [pageCount]
  );

  return (
    <div>
      <div>
        <div>
          <SearchInput placeholder="Search by name" value={search} onChange={handleSearch} />
        </div>

        <div>
          <Select
            placeholder="All Types"
            value={type}
            onChange={handleType}
            leftIcon={<Filter />}
            options={HomeSectionsFilterOptions}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto my-3">
        {sectionsIsLoading ? (
          <LayoutSkeleton />
        ) : sectionsError ? (
          <div className="py-10 text-center text-sm text-destructive">Failed to load sections</div>
        ) : sectionData?.sections.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No active sections match your filters
          </div>
        ) : (
          (sectionData?.sections ?? []).map(section => (
            <AvailableSectionRow
              key={section.id}
              isAdded={layoutIds.has(section.id)}
              section={section}
              onAdd={onAdd}
            />
          ))
        )}
      </div>
      <Pagination pageIndex={pageIndex} pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
}

type HomeSectionTypeKey = keyof typeof HOME_SECTION_TYPE_LABELS;

function getSectionTypeLabel(type: unknown) {
  const key = String(type) as HomeSectionTypeKey;
  return HOME_SECTION_TYPE_LABELS[key] ?? String(type);
}

function AvailableSectionRow({
  section,
  onAdd,
  isAdded = false,
}: {
  section: { id: string; name: string; type: unknown };
  onAdd: (section: AdminHomeSection) => void;
  isAdded?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border bg-background">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{section.name}</p>
        <p className="text-[11px] text-muted-foreground">{getSectionTypeLabel(section.type)}</p>
      </div>

      <Button
        size="sm"
        disabled={isAdded}
        onClick={() => onAdd(section as unknown as AdminHomeSection)}
      >
        {isAdded ? 'Added' : 'Add'}
      </Button>
    </div>
  );
}

function Pagination({
  pageIndex,
  pageCount,
  onPageChange,
}: {
  pageIndex: number;
  pageCount: number;
  onPageChange: (next: number) => void;
}) {
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  const pages: number[] = [];
  const start = Math.max(0, pageIndex - 2);
  const end = Math.min(pageCount - 1, pageIndex + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="text-xs text-muted-foreground">
        Page {pageIndex + 1} of {pageCount}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          Prev
        </Button>

        {start > 0 && (
          <>
            <PageBtn active={pageIndex === 0} onClick={() => onPageChange(0)}>
              1
            </PageBtn>
            <span className="px-1 text-muted-foreground">…</span>
          </>
        )}

        {pages.map(p => (
          <PageBtn key={p} active={p === pageIndex} onClick={() => onPageChange(p)}>
            {p + 1}
          </PageBtn>
        ))}

        {end < pageCount - 1 && (
          <>
            <span className="px-1 text-muted-foreground">…</span>
            <PageBtn
              active={pageIndex === pageCount - 1}
              onClick={() => onPageChange(pageCount - 1)}
            >
              {pageCount}
            </PageBtn>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function PageBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'h-8 min-w-8 px-2 rounded-md text-sm border transition-colors',
        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
