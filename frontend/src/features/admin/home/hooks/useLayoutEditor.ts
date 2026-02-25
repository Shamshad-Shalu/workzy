import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { HomeSectionType } from '@/constants';
import type { AdminHomeSection, SectionListItem } from '@/types/admin/home';
import type { LayoutSectionItem } from '@/types/home/layoutSection';

type SaveSchema = {
  safeParse: (
    data: unknown
  ) =>
    | { success: true; data: { items: SectionListItem[] } }
    | { success: false; error: { issues: { message: string }[] } };
};

interface Props {
  layoutSections?: SectionListItem[];
  saveSchema: SaveSchema;
  onSave: (items: LayoutSectionItem[]) => Promise<{ message: string }>;
}

export function useLayoutEditor({ layoutSections, saveSchema, onSave }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layoutItems, setLayoutItems] = useState<SectionListItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dragIndex = useRef<number | null>(null);

  const buildInitialItems = useCallback((): SectionListItem[] => {
    return (layoutSections ?? []).map((s, i) => ({
      sectionId: s.sectionId,
      sectionName: s.sectionName,
      sectionType: s.sectionType,
      order: i + 1,
    }));
  }, [layoutSections]);

  useEffect(() => {
    if (!isEditMode) {
      setLayoutItems(buildInitialItems());
    }
  }, [isEditMode, buildInitialItems]);

  const layoutIds = useMemo(() => new Set(layoutItems.map(i => i.sectionId)), [layoutItems]);

  const isDirty = useMemo(() => {
    const a = JSON.stringify(layoutItems.map(i => i.sectionId));
    const b = JSON.stringify((layoutSections ?? []).map(s => s.sectionId));
    return a !== b;
  }, [layoutItems, layoutSections]);

  const setEditMode = () => setIsEditMode(true);

  const reset = () => {
    setIsEditMode(false);
    setLayoutItems(buildInitialItems());
    setValidationErrors([]);
  };

  const removeSection = (sectionId: string) => {
    setLayoutItems(prev =>
      prev.filter(i => i.sectionId !== sectionId).map((item, idx) => ({ ...item, order: idx + 1 }))
    );
    setValidationErrors([]);
  };

  const addSection = (section: AdminHomeSection) => {
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
  };

  const dragStart = (index: number) => {
    dragIndex.current = index;
  };

  const dragEnter = (index: number) => {
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

  const dragEnd = () => {
    dragIndex.current = null;
  };

  const save = async () => {
    const result = saveSchema.safeParse({ items: layoutItems });
    if (!result.success) {
      setValidationErrors(result.error.issues.map(i => i.message));
      throw new Error('validation');
    }

    setValidationErrors([]);

    const payload = result.data.items.map(item => ({
      sectionId: item.sectionId,
      order: item.order,
    }));

    const res = await onSave(payload);
    setIsEditMode(false);
    return res;
  };

  return {
    isEditMode,
    layoutItems,
    layoutIds,
    validationErrors,
    isDirty,

    setEditMode,
    reset,
    save,
    removeSection,
    addSection,
    dragHandlers: { dragStart, dragEnter, dragEnd },
  };
}
