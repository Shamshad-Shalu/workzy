import AdminCategoryService from '@/services/admin/categoryManagement.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CategoryFormData } from '../validation/categorySchema';

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      AdminCategoryService.updateCategory(id, data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => AdminCategoryService.createCategory(data),

    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    }
  });

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminCategoryService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  return { updateCategoryMutation, addCategoryMutation, toggleStatusMutation };
}
