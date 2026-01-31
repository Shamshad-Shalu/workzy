import { createAsyncThunk } from '@reduxjs/toolkit';

import { profileApi } from '@/features/profile/api/profile.api';

import { updateUser } from '../slices/authSlice';
import { setLocation } from '../slices/locationSlice';

export const bootstrapUserProfile = createAsyncThunk(
  'app/bootstrapUserProfile',
  async (_, { dispatch }) => {
    const user = await profileApi.getProfilePage();

    dispatch(updateUser(user));

    const location = user.profile?.location;
    const city = user.profile?.address?.city;
    if (location) {
      dispatch(
        setLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
          city: city ?? 'Unknown',
        })
      );
    }

    return user;
  }
);
