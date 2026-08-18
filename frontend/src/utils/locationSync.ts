import { setLocation } from '@/store/slices/locationSlice';
import type { AppDispatch } from '@/store/store';
import type { User } from '@/types/user';

export const syncUserLocation = (dispatch: AppDispatch, user: User | null) => {
  if (!user?.profile?.address || !user?.profile?.location?.coordinates) {
    return;
  }
  const { address, location } = user.profile;
  const formattedAddress = Object.values(address).filter(Boolean).join(' ,');

  dispatch(
    setLocation({
      city: address.city || 'calicut',
      address: formattedAddress,
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
    })
  );
};
