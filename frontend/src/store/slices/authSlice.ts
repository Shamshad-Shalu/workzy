import { SESSION_MESSAGES } from '@/constants';
import api from '@/lib/api/axios';
import type { User } from '@/types/user';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  status: 'idle',
};

// Refresh TokenThunk
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_NEVER, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/refresh-token', {}, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(SESSION_MESSAGES.EXPIRED);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // set user and token after login
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem('sessionActive', 'true');
    },
    // update access token after refresh
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    // Logout
    clearUser: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('sessionActive');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshAccessToken.pending, state => {
        state.status = 'loading';
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { user, accessToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.status = 'failed';
      });
  },
});

export const { setCredentials, updateToken, clearUser } = authSlice.actions;
export default authSlice.reducer;
