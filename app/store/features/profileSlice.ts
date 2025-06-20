import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';

export const createPersonalProfileAsync = createAsyncThunk(
  'profile/createPersonal',
  async (profileData: any, { rejectWithValue }) => {
    try {
      console.log('Making API call to:', '/profile');
      const response = await api.post('/profile', profileData);
      console.log('API response:', response);
      return response.data;
    } catch (error: any) {
      console.error('API error:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createAddressAsync = createAsyncThunk(
  'profile/createAddress',
  async (addressData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/address', addressData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createEducationAsync = createAsyncThunk(
  'profile/createEducation',
  async (educationData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/education', educationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createEmploymentAsync = createAsyncThunk(
  'profile/createEmployment',
  async (employmentData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/employment', employmentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createLifestyleAsync = createAsyncThunk(
  'profile/createLifestyle',
  async (lifestyleData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/lifestyle', lifestyleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    error: null,
    personalProfile: null,
    address: null,
    education: null,
    employment: null,
    lifestyle: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPersonalProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPersonalProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.personalProfile = action.payload;
      })
      .addCase(createPersonalProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createAddressAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(createAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createEducationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEducationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(createEducationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createEmploymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmploymentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employment = action.payload;
      })
      .addCase(createEmploymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createLifestyleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLifestyleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lifestyle = action.payload;
      })
      .addCase(createLifestyleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default profileSlice.reducer;
