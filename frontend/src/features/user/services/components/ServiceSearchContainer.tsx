import type { CategorySuggestion } from '@/types/category';
import { useEffect, useState } from 'react';
import { useCategorySuggestions, useTrendingCategories } from '../hooks/useServices';
import ServiceSearchModal from './ServiceSearchModal';

interface ServiceSearchContainerProps {
  open: boolean;
  onClose: () => void;
  externalSearchQuery: string;
  onSelectService: (service: CategorySuggestion) => void;
}

export default function ServiceSearchContainer({
  open,
  onClose,
  externalSearchQuery,
  onSelectService,
}: ServiceSearchContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!open) {
      setInternalSearchQuery('');
    }
  }, [open]);

  const searchQuery = isMobile ? internalSearchQuery : externalSearchQuery;
  const searchEnabled = open && searchQuery.trim().length >= 2;
  const trendingEnabled = open && !searchQuery.trim();

  const { data: categoryServices = [], isLoading: isSearching } = useCategorySuggestions(
    searchQuery,
    searchEnabled
  );
  const { data: trending = [], isLoading: isTrendingLoading } =
    useTrendingCategories(trendingEnabled);

  return (
    <ServiceSearchModal
      open={open}
      onClose={onClose}
      isMobile={isMobile}
      searchQuery={searchQuery}
      internalSearchQuery={internalSearchQuery}
      setInternalSearchQuery={setInternalSearchQuery}
      categoryServices={categoryServices}
      trending={trending}
      isSearching={isSearching}
      isTrendingLoading={isTrendingLoading}
      onSelectService={onSelectService}
    />
  );
}
