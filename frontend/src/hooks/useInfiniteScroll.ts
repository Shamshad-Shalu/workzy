import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = observerRef.current;
    if (!el) {return;}

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return observerRef;
};
