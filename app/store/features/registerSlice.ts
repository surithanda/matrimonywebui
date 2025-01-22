import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  primaryPhone: string;
}

interface RegisterState {
  registerData: RegisterPayload;
  loading: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  registerData: {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    primaryPhone: '',
  },
  loading: false,
  error: null,
};

// Async thunk for registering a user
export const registerUserAsync = createAsyncThunk(
  'register/registerUser',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/register', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetForm: (state) => {
      state.registerData = initialState.registerData;
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
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetForm, setLoading, setError } = registerSlice.actions;

export default registerSlice.reducer;
