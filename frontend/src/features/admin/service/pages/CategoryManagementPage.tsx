import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Layers } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';

import SearchInput from '@/components/molecules/SearchInput';
import PageHeader from '@/components/molecules/PageHeader';
import AppBreadcrumb from '@/components/molecules/AppBreadcrumb';
import { AppModal } from '@/components/molecules/AppModal';
import Table from '@/components/data-table/Table';
import categoryColumns from '../components/CategoryColumns';
import { CategoryModal } from '../components/CategoryModal';
import { useCategoryMutations } from '../hooks/useCategoryMutations';
import { handleApiError } from '@/utils/handleApiError';
import type { Category } from '@/types/admin/category';
import type { CategoryFormData } from '../validation/categorySchema';
import { useCategoryUrlParams } from '../hooks/useCategoryUrlParams';

type CategoryCrumb = { id: string; name: string };

export default function CategoryManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { pageIndex, pageSize, parentId, search, status, updateParams } = useCategoryUrlParams();
  const {
    addCategoryMutation,
    updateCategoryMutation,
    toggleStatusMutation,
    data,
    isLoading,
    isError,
    error,
    parentCategory,
  } = useCategoryMutations({ pageIndex, pageSize, search, status, parentId });

  const currentLevel = parentCategory ? parentCategory.level + 1 : 1;
  const path = (location.state?.path as CategoryCrumb[]) || [];

  useEffect(() => {
    if (isError) {
      toast.error(handleApiError(error));
    }
  }, [isError, error]);

  const breadcrumbItems = [
    {
      label: 'Categories',
      href: '/admin/categories',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/admin/categories', { state: { path: [] } });
      },
    },
  ];

  if (path && Array.isArray(path)) {
    path.forEach((crumb, index) => {
      breadcrumbItems.push({
        label: crumb.name,
        href: '#',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          const newPath = path.slice(0, index + 1);
          navigate(`?parentId=${crumb.id}&page=1`, { state: { path: newPath } });
        },
      });
    });
  }

  const openStatusModal = (category: Category) => {
    setSelectedCategory(category);
    setStatusModalOpen(true);
  };

  const handleSearchChange = useCallback(
    (v: string) => {
      updateParams({ search: v, page: 0, parentId });
    },
    [parentId, updateParams]
  );

  const onEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const onViewChild = (category: Category) => {
    const newPath = [...path, { id: category._id, name: category.name }];
    navigate(`?parentId=${category._id}&page=1`, {
      state: { path: newPath },
    });
  };

  const handleCategorySubmit = async (categoryData: CategoryFormData) => {
    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory._id,
        data: categoryData,
      });
    } else {
      await addCategoryMutation.mutateAsync(categoryData);
    }
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Category Management" />
        <Button
          variant="blue"
          disabled={isError}
          size="lg"
          onClick={() => setCategoryModalOpen(true)}
          iconLeft={<Layers />}
        >
          Add Category
        </Button>
      </div>
      <div className="mb-4">
        <AppBreadcrumb items={breadcrumbItems} />
      </div>
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <SearchInput
              disabled={isError}
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="sm:col-span-5">
            <Select
              value={status}
              onChange={v => updateParams({ status: v, page: 0 })}
              leftIcon={<Filter />}
              disabled={isError}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
        </div>
      </div>
      <Table
        columns={categoryColumns(currentLevel, openStatusModal, onEdit, onViewChild)}
        data={data?.categories ?? []}
        total={data?.total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
        manual={{
          serverSidePagination: true,
        }}
        isLoading={isLoading}
        onPageChange={p => updateParams({ page: p })}
        onPageSizeChange={s => updateParams({ pageSize: s, page: 0 })}
      />

      <AppModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        isTitleHidden={true}
        confirmText={selectedCategory?.isAvailable ? 'Block' : 'Unblock'}
        onConfirm={() => {
          if (!selectedCategory?._id) {
            return;
          }
          toggleStatusMutation.mutate(selectedCategory?._id, {
            onSuccess: () => setStatusModalOpen(false),
          });
        }}
        className="sm:mx-1"
      >
        <span className="block mb-2">
          Are you sure you want to {selectedCategory?.isAvailable ? 'Block' : 'Unblock'}{' '}
          <b>{selectedCategory?.name}</b>
        </span>
      </AppModal>

      <CategoryModal
        open={categoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSubmit={handleCategorySubmit}
        category={editingCategory}
        parentCategory={parentCategory}
      />
    </div>
  );
}
