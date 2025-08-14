import { api } from '@/app/lib/axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface SearchFilters {
  profile_id?: number;
  min_age?: number;
  max_age?: number;
  religion?: number | null;
  max_education?: number | null;
  occupation?: number | null;
  country?: string | null;
  caste_id?: number | null;
  marital_status?: number | null;
  gender?: string | null;
  // For backward compatibility
  location_preference?: string | null;
  distance_preference?: number | null;
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
  gender?: string | null;
  religion?: number | null;
  max_education?: number | null;
  occupation?: number | null;
  country?: string | null;
  caste_id?: number | null;
  marital_status?: number | null;
  // For backward compatibility
  location_preference?: string | null;
  distance_preference?: number | null;
  created_user?: string;
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
      const data = response.data.data || {};
      
      // Map backend response to our frontend structure
      const preferences: UserPreferences = {
        profile_id: data.profile_id,
        min_age: data.min_age,
        max_age: data.max_age,
        gender: data.gender,
        religion: data.religion,
        max_education: data.max_education,
        occupation: data.occupation,
        country: data.location_preference, // Map location_preference to country
        caste_id: data.caste,
        marital_status: data.marital_status,
        created_user: data.created_user
      };
      
      return preferences;
    } catch (error: any) {
      // If no preferences exist, return empty object instead of error
      if (error.response?.status === 404) {
        return {};
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to load user preferences');
    }
  }
);

// Async thunk to save user preferences
export const saveUserPreferences = createAsyncThunk(
  'search/saveUserPreferences',
  async (preferences: UserPreferences, { rejectWithValue }) => {
    try {
      // Map frontend structure to backend API expected format
      const requestData = {
        profile_id: preferences.profile_id,
        min_age: preferences.min_age,
        max_age: preferences.max_age,
        gender: preferences.gender,
        religion: preferences.religion,
        max_education: preferences.max_education,
        occupation: preferences.occupation,
        country: preferences.country, // This will be mapped to location_preference in the backend
        caste: preferences.caste_id,
        marital_status: preferences.marital_status,
        created_user: preferences.created_user
      };
      
      const response = await api.post('/profile/search/preferences', requestData);
      
      // Map the response back to our frontend structure
      const responseData = response.data.data || {};
      const savedPreferences: UserPreferences = {
        profile_id: responseData.profile_id,
        min_age: responseData.min_age,
        max_age: responseData.max_age,
        gender: responseData.gender,
        religion: responseData.religion,
        max_education: responseData.max_education,
        occupation: responseData.occupation,
        country: responseData.location_preference, // Map location_preference to country
        caste_id: responseData.caste,
        marital_status: responseData.marital_status,
        created_user: responseData.created_user
      };
      
      return savedPreferences;
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
