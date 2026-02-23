import Button from '@/components/atoms/Button';

export default function Pagination({
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
  for (let i = start; i <= end; i++) {pages.push(i);}

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
