import { api } from '@/app/lib/axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface SearchFilters {
  profile_id?: number;
  min_age?: number;
  max_age?: number;
  religion?: number;
  max_education?: number;
  occupation?: number;
  country?: string;
  caste_id?: number;
  marital_status?: number;
  gender?: string;
  location_preference?: string;
  distance_preference?: number;
  [key: string]: any; // Allow additional properties for flexibility
}

export interface Profile {
  profile_id: number;
  first_name: string;
  last_name: string;
  age: number;
  location: string;
  religion?: string;
  education?: string;
  occupation?: string;
  photo_url?: string;
  // Add other profile fields as needed
}

export interface UserPreferences {
  profile_id?: number;
  min_age?: number;
  max_age?: number;
  gender?: string;
  location_preference?: string;
  distance_preference?: number;
}

export interface SearchState {
  profiles: Profile[];
  filters: SearchFilters;
  userPreferences: UserPreferences;
  metadata: {
    religions: Array<{ id: number; name: string }>;
    educationLevels: Array<{ id: number; name: string }>;
    occupations: Array<{ id: number; name: string }>;
    countries: Array<{ id: number; name: string }>;
    genders: Array<{ id: number; name: string }>;
    maritalStatuses: Array<{ id: number; name: string }>;
  };
  loading: boolean;
  error: string | null;
  metadataLoading: boolean;
  preferencesLoading: boolean;
  preferencesError: string | null;
}

const initialState: SearchState = {
  profiles: [],
  filters: {},
  userPreferences: {},
  metadata: {
    religions: [],
    educationLevels: [],
    occupations: [],
    countries: [],
    genders: [],
    maritalStatuses: []
  },
  loading: false,
  error: null,
  metadataLoading: false,
  preferencesLoading: false,
  preferencesError: null
};

// Async thunks
export const searchProfiles = createAsyncThunk(
  'search/searchProfiles',
  async (filters: SearchFilters, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/search', filters);
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search profiles');
    }
  }
);

export const getUserPreferences = createAsyncThunk(
  'search/getUserPreferences',
  async (profileId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/search/preferences/${profileId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user preferences');
    }
  }
);

export const saveUserPreferences = createAsyncThunk(
  'search/saveUserPreferences',
  async (preferences: UserPreferences, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/search/preferences', preferences);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save user preferences');
    }
  }
);

// Note: fetchMetadata and fetchCountries are now imported from metaDataSlice

// Slice
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    setUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload };
    },
    clearUserPreferences: (state) => {
      state.userPreferences = {};
    },
    clearPreferencesError: (state) => {
      state.preferencesError = null;
    }
  },
  extraReducers: (builder) => {
    // Search profiles
    builder
      .addCase(searchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload || [];
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // User preferences
      .addCase(getUserPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.preferencesError = null;
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.userPreferences = action.payload || {};
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.preferencesError = action.payload as string;
      })
      .addCase(saveUserPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.preferencesError = null;
      })
      .addCase(saveUserPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.userPreferences = action.payload || state.userPreferences;
      })
      .addCase(saveUserPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.preferencesError = action.payload as string;
      });

    // Note: Metadata and countries fetching is now handled by metaDataSlice
  }
});

export const { setFilters, clearFilters, clearError, setProfiles, setUserPreferences, clearUserPreferences, clearPreferencesError } = searchSlice.actions;
export default searchSlice.reducer;
