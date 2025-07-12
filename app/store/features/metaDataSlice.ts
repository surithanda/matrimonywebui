import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';

interface CountryPayload {
  country_id: string | number;
  country_name: string;
  official_name: string;
  country_code_2: string;
  country_code_3: string;
  country_number: string | number;
  country_calling_code: string | number;
  region: string;
  latitude: number;
  longitude: number;
  flag_emoji: any;
  flag_image_url: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

interface StatePayload {
  state_id: string | number;
  country_id: string | number;
  state_name: string;
  state_code: string;
  state_type: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

interface LookupPayload {
  id: string | number;
  name: string;
  description: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

interface MetaState {
  addresstypeList: LookupPayload[];
  phonetypeList: LookupPayload[];
  genderList: LookupPayload[];
  contactList: LookupPayload[];
  familyList: LookupPayload[];
  referenceList: LookupPayload[];
  friendList: LookupPayload[];
  maritalstatusList: LookupPayload[];
  professionList: LookupPayload[];
  religionList: LookupPayload[];
  disabilityList: LookupPayload[];
  nationalityList: LookupPayload[];
  casteList: LookupPayload[];
  
  stateList: StatePayload[];
  countryList: CountryPayload[];
  loading: boolean;
  error: string | null;
}

const initialState: MetaState = {
  addresstypeList: [],
  phonetypeList: [],
  genderList: [],
  contactList: [],
  familyList: [],
  referenceList: [],
  friendList: [],
  maritalstatusList: [],
  professionList: [],
  religionList: [],
  disabilityList: [],
  nationalityList: [],
  casteList: [],
  stateList: [],
  countryList: [],
  loading: false,
  error: null,
};

// Async thunk for fetching metadata category
export const getMetaDataAsync = createAsyncThunk(
  'metaData/metaDataCategory',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/metaData/category', payload);
      if (response.status === 200 || response.status === 201) {
        return response.data?.data;
      }
      return rejectWithValue('Failed to load Metadata');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load Metadata';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCountriesAsync = createAsyncThunk(
  'metaData/countries',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/metaData/countries');
      if (response.status === 200 || response.status === 201) {
        return response.data?.data;
      }
      return rejectWithValue('Failed to load Countries Metadata');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load Countries Metadata';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getStatesAsync = createAsyncThunk(
  'metaData/states',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/metaData/states', payload);
      if (response.status === 200 || response.status === 201) {
        return response.data?.data;
      }
      return rejectWithValue('Failed to load States Metadata');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load States Metadata';
      return rejectWithValue(errorMessage);
    }
  }
);

const metaDataSlice = createSlice({
  name: 'metaData',
  initialState,
  reducers: {
    setMetadataCategory: (state, action) => {
      const {category, payload} = action.payload;
      const formattedCategory = category.toLowerCase().replace(' ', '');
      // Dynamically set the category list based on the category name
      state[`${formattedCategory}List`] = payload;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMetaDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMetaDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        // state.data = action.payload.data;
      })
      .addCase(getMetaDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMetadataCategory, setLoading, setError } = metaDataSlice.actions;

export default metaDataSlice.reducer;
