import { useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';

import type { HomeSectionFormData } from '../../validation/section-schemas';

export default function TitleSubtitleFields() {
  const { register, getFieldState } = useFormContext<HomeSectionFormData>();

  const titleState = getFieldState('data.title');
  const subTitleState = getFieldState('data.subTitle');

  return (
    <div className="grid gap-x-4 grid-cols-1 sm:grid-cols-2">
      <div>
        <Label>Title</Label>
        <Input
          {...register('data.title')}
          className="px-4"
          error={titleState.error?.message}
          placeholder="Please Enter Title"
        />
      </div>

      <div>
        <Label>Sub Title</Label>
        <Input
          {...register('data.subTitle')}
          className="px-4"
          error={subTitleState.error?.message}
          placeholder="Please Enter Sub Title"
        />
      </div>
    </div>
  );
}
