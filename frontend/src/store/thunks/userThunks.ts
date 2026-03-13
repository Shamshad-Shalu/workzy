import { createAsyncThunk } from '@reduxjs/toolkit';

import { profileApi } from '@/services/profile.service';

import { updateUser } from '../slices/authSlice';
import { setLocation } from '../slices/locationSlice';

export const bootstrapUserProfile = createAsyncThunk(
  'app/bootstrapUserProfile',
  async (_, { dispatch }) => {
    const user = await profileApi.getProfilePage();

    dispatch(updateUser(user));

    const location = user.profile?.location;
    const profile = user.profile?.address;
    const city = profile?.city;
    const address = `${profile?.place},${profile?.city}, ${profile?.state}-${profile?.pincode}`;
    if (location) {
      dispatch(
        setLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
          city: city ?? 'Unknown',
          address: address ?? 'Unknow',
        })
      );
    }

    return user;
  }
);
