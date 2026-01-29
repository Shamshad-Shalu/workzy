import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  city: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const initialState: LocationState = {
  city: 'calicut',
  latitude: 11.2588,
  longitude: 75.7804,
  radius: 30,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{
        city: string;
        latitude: number;
        longitude: number;
      }>
    ) => {
      state.city = action.payload.city;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.radius = action.payload;
    },
  },
});

export const { setLocation, setRadius } = locationSlice.actions;
export default locationSlice.reducer;
