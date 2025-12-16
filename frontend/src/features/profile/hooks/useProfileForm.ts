import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@/types/user';
import { type ProfileFormType, ProfileSchema } from '../validation/profileSchema';

interface UseProfileFormProps {
  user: User;
  onSave: (payload: Partial<User>) => Promise<void>;
}

export function useProfileForm({ user, onSave }: UseProfileFormProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const defaultValues: ProfileFormType = {
    name: user.name,
    profile: {
      address: user.profile?.address
        ? {
          house: user.profile.address.house || '',
          place: user.profile.address.place || '',
          city: user.profile.address.city || '',
          state: user.profile.address.state || '',
          pincode: user.profile.address.pincode || '',
        }
        : undefined,
      location:
        user.profile?.location?.coordinates && user.profile.location.coordinates.length === 2
          ? {
              type: 'Point',
              coordinates: user.profile.location.coordinates as [number, number],
            }
          : undefined,
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const currentLocation = watch('profile.location');
  const isLocationSet = !!currentLocation?.coordinates;

  useEffect(() => {
    reset(defaultValues);
  }, [user, reset]);

  const handleLocationSelect = (coordinates: [number, number], address?: any) => {
    setValue(
      'profile.location',
      {
        type: 'Point',
        coordinates,
      },
      { shouldDirty: true, shouldValidate: true }
    );

    if (address) {
      if (address.place) {
        setValue('profile.address.place', address.place);
      }
      if (address.city) {
        setValue('profile.address.city', address.city);
      }
      if (address.state) {
        setValue('profile.address.state', address.state);
      }
      if (address.pincode) {
        setValue('profile.address.pincode', address.pincode);
      }
    }

    setShowMap(false);
  };

  const handleSetLocation = () => {
    setShowMap(true);
  };

  async function onSubmit(data: ProfileFormType) {
    await onSave({
      name: data.name,
      profile: {
        ...data.profile,
        location: user.profile?.location || data.profile.location,
      },
    });
    setIsEditing(false);
  }

  const handleCancel = () => {
    setIsEditing(false);
    reset(defaultValues);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    setValue,

    isEditing,
    showMap,
    currentLocation,
    isLocationSet,

    setIsEditing,
    setShowMap,
    handleLocationSelect,
    handleSetLocation,
    onSubmit,
    handleCancel,
  };
}
