import { AlertCircle, Pencil, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import type { LayoutSectionItem } from '@/types/home/layoutSection';

import LayoutPanel from '../components/LayoutPanel';
import SectionOptionsPanel from '../components/SectionOptionsPanel';
import { useHomeLayout } from '../hooks/useHomeLayout';
import { useLayoutEditor } from '../hooks/useLayoutEditor';
import { saveLayoutSchema } from '../validation/layout-schema';

export default function HomeLayoutPage() {
  const { layout, layoutError, layoutIsLoading, updateLayout } = useHomeLayout();

  const {
    save,
    isEditMode,
    addSection,
    dragHandlers,
    isDirty,
    layoutIds,
    layoutItems,
    removeSection,
    reset,
    setEditMode,
    validationErrors,
  } = useLayoutEditor({
    layoutSections: layout?.sections,
    saveSchema: saveLayoutSchema,
    onSave: (payload: LayoutSectionItem[]) => updateLayout.mutateAsync(payload),
  });

  return (
    <main>
      <div className="flex justify-end -mt-6 gap-2 shrink-0">
        {!isEditMode ? (
          <Button iconRight={<Pencil size={18} />} variant="blue" onClick={setEditMode}>
            Edit Layout
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              iconLeft={<RotateCcw className="size-3.5" />}
              onClick={reset}
            >
              Reset
            </Button>
            <Button
              variant="green"
              onClick={async () => {
                const { message } = await save();
                toast.success(message);
              }}
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
          <LayoutPanel
            isEditMode={isEditMode}
            items={layoutItems}
            isLoading={layoutIsLoading}
            error={layoutError}
            removeSection={removeSection}
            dragHandlers={dragHandlers}
          />
        </div>
        {isEditMode && (
          <div className="rounded-2xl border bg-card p-4 md:col-span-5">
            <SectionOptionsPanel layoutIds={layoutIds} onAdd={addSection} />
          </div>
        )}
      </div>
    </main>
  );
}
