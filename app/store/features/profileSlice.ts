// Get Interests Thunk
export const getInterestsAsync = createAsyncThunk(
  'profile/getInterests',
  async (data: { profile_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/interestsDetails', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
// HOBBIES/INTERESTS THUNKS
export const getHobbiesInterestsAsync = createAsyncThunk(
  'profile/getHobbiesInterests',
  async (data: { profile_id: number, category: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/hobbiesDetails', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const addHobbyAsync = createAsyncThunk(
  'profile/addHobby',
  async (payload: { profile_id: number, hobby: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/hobby', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const removeHobbyAsync = createAsyncThunk(
  'profile/removeHobby',
  async (payload: { profile_id: number, hobby: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/hobby`, { data: payload });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const addInterestAsync = createAsyncThunk(
  'profile/addInterest',
  async (payload: { profile_id: number, hobby: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/hobby', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const removeInterestAsync = createAsyncThunk(
  'profile/removeInterest',
  async (payload: { profile_id: number, interest: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/interest`, { data: payload });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
// PROPERTY THUNKS
export const getPropertiesAsync = createAsyncThunk(
  'profile/getProperties',
  async (data: { profile_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/propertyDetails', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createPropertyAsync = createAsyncThunk(
  'profile/createProperty',
  async (propertyData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/property', propertyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const updatePropertyAsync = createAsyncThunk(
  'profile/updateProperty',
  async (propertyData: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/profile/property/${propertyData.id}`, propertyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const deletePropertyAsync = createAsyncThunk(
  'profile/deleteProperty',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/property/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
// REFERENCE THUNKS
export const getReferenceAsync = createAsyncThunk(
  'profile/getReference',
  async (data: { profile_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/referenceDetails', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createReferenceAsync = createAsyncThunk(
  'profile/createReference',
  async (referenceData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/reference', referenceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const updateReferenceAsync = createAsyncThunk(
  'profile/updateReference',
  async (referenceData: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/profile/reference/${referenceData.id}`, referenceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const deleteReferenceAsync = createAsyncThunk(
  'profile/deleteReference',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/reference/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
// FAMILY THUNKS
export const getFamilyAsync = createAsyncThunk(
  'profile/getFamily',
  async (data: { profile_id: number, type: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/family-referenceDetails', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createFamilyAsync = createAsyncThunk(
  'profile/createFamily',
  async (familyData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/family', familyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const updateFamilyAsync = createAsyncThunk(
  'profile/updateFamily',
  async (familyData: any, { rejectWithValue }) => {
    try {
      const response = await api.put(`/profile/family/${familyData.id}`, familyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const deleteFamilyAsync = createAsyncThunk(
  'profile/deleteFamily',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/family/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';

interface ProfileState {
  loading: boolean;
  error: string | null;
  personalProfile: any;
  address: any;
  education: any;
  employment: any;
  lifestyle: any;
  family: any[];
  properties: any[];
  hobbies: string[];
  interests: string[];
  references: any[];
}

export const getPersonalProfileAsync = createAsyncThunk(
  'profile/getPersonal',
  async (profileData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/personalDetails', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const createPersonalProfileAsync = createAsyncThunk(
  'profile/createPersonal',
  async (profileData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/personal', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const getAddressAsync = createAsyncThunk(
  'profile/getAddress',
  async (addressData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/addressDetails', addressData);
      return response.data;
    } catch (error: any) {
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

export const getEducationAsync = createAsyncThunk(
  'profile/getEducation',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/educationDetails', data);
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

export const getEmploymentAsync = createAsyncThunk(
  'profile/getEmployment',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/employmentDetails', data);
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

export const getLifestyleAsync = createAsyncThunk(
  'profile/getLifestyle',
  async (data: { profile_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/profile/lifestyleDetails', data);
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

export const updateLifestyleAsync = createAsyncThunk(
  'profile/updateLifestyle',
  async (lifestyleData: any, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/lifestyle', lifestyleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const initialState: ProfileState = {
  loading: false,
  error: null,
  personalProfile: null,
  address: null,
  education: null,
  employment: null,
  lifestyle: null,
  family: [],
  properties: [],
  hobbies: [],
  interests: [],
  references: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // PERSONAL PROFILE
      .addCase(getPersonalProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPersonalProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.personalProfile = action.payload;
      })
      .addCase(getPersonalProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // ADDRESS
      .addCase(getAddressAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(getAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // EDUCATION
      .addCase(getEducationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEducationAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(getEducationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // EMPLOYMENT
      .addCase(getEmploymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmploymentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.employment = action.payload;
      })
      .addCase(getEmploymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // HOBBIES/INTERESTS
      // (Removed duplicate getInterestsAsync handlers)
      .addCase(getInterestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInterestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.interests = action.payload?.interests || [];
      })
      .addCase(getInterestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(getHobbiesInterestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHobbiesInterestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Handle category-specific responses
        const category = action.meta.arg.category;
        if (category === 'hobby') {
          state.hobbies = action.payload?.data || action.payload?.hobbies || [];
        } else if (category === 'interest') {
          state.interests = action.payload?.data || action.payload?.interests || [];
        }
      })
      .addCase(getHobbiesInterestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(addHobbyAsync.fulfilled, (state, action) => {
        if (action.payload?.hobby) {
          state.hobbies = [...(state.hobbies || []), action.payload.hobby];
        }
      })
      .addCase(removeHobbyAsync.fulfilled, (state, action) => {
        if (action.meta.arg && action.meta.arg.hobby) {
          state.hobbies = (state.hobbies || []).filter((h) => h !== action.meta.arg.hobby);
        }
      })
      .addCase(addInterestAsync.fulfilled, (state, action) => {
        if (action.payload?.interest) {
          state.interests = [...(state.interests || []), action.payload.interest];
        }
      })
      .addCase(removeInterestAsync.fulfilled, (state, action) => {
        if (action.meta.arg && action.meta.arg.interest) {
          state.interests = (state.interests || []).filter((i) => i !== action.meta.arg.interest);
        }
      })
      // PROPERTY
      .addCase(getPropertiesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertiesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload?.data || [];
      })
      .addCase(getPropertiesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createPropertyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPropertyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally push to state.properties
      })
      .addCase(createPropertyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(updatePropertyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePropertyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state.properties
      })
      .addCase(updatePropertyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(deletePropertyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropertyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove from state.properties
      })
      .addCase(deletePropertyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
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
      })
      .addCase(getLifestyleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLifestyleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lifestyle = action.payload;
      })
      .addCase(getLifestyleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(updateLifestyleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLifestyleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lifestyle = action.payload;
      })
      .addCase(updateLifestyleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // FAMILY
      .addCase(getFamilyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFamilyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.family = action.payload?.data || [];
      })
      .addCase(getFamilyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createFamilyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFamilyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally push to state.family
      })
      .addCase(createFamilyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(updateFamilyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFamilyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state.family
      })
      .addCase(updateFamilyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(deleteFamilyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFamilyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove from state.family
      })
      .addCase(deleteFamilyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      // REFERENCES
      .addCase(getReferenceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReferenceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.references = action.payload?.data || [];
      })
      .addCase(getReferenceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(createReferenceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReferenceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally push to state.references
      })
      .addCase(createReferenceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(updateReferenceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReferenceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state.references
      })
      .addCase(updateReferenceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(deleteReferenceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReferenceAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove from state.references
      })
      .addCase(deleteReferenceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      });
  },
});

export default profileSlice.reducer;
