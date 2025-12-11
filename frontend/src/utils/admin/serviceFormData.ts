import type { ServiceDTO } from '@/types/admin/service';

export function serviceToFormData(dto: ServiceDTO): FormData {
  const fd = new FormData();

  fd.append('name', dto.name);
  fd.append('description', dto.description ?? '');
  fd.append('parentId', dto.parentId ?? '');
  fd.append('platformFee', String(dto.platformFee));
  fd.append('level', String(dto.level ?? 1));

  if (dto.iconUrl instanceof File) {
    fd.append('iconUrl', dto.iconUrl);
  }
  if (dto.imageUrl instanceof File) {
    fd.append('imageUrl', dto.imageUrl);
  }

  return fd;
}
