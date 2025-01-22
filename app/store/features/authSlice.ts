import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../lib/axios';

interface LoginPayload {
  email: string;
  password: string;
}

interface OtpPayload {
  history_id: number;
  otp: string;
}

interface AuthState {
  loginData: LoginPayload;
  otpData: OtpPayload | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginResponse: any | null;
}

const initialState: AuthState = {
  loginData: {
    email: '',
    password: '',
  },
  otpData: null,
  token: null,
  loading: false,
  error: null,
  loginResponse: null,
};

// Async thunk for logging in
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', payload, {
        headers: {
          'x-api-key': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for verifying OTP
export const verifyOtpAsync = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: OtpPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/verify-otp', payload, {
        headers: {
          'x-api-key': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<LoginPayload>) => {
      state.loginData = action.payload;
    },
    resetAuthState: (state) => {
      state.loginData = initialState.loginData;
      state.otpData = null;
      state.token = null;
      state.error = null;
    },
    setLoginResponse: (state, action: PayloadAction<any>) => {
      state.loginResponse = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.loading = false;
        state.otpData = null; // Clear OTP data on success
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoginData, resetAuthState, setLoginResponse } = authSlice.actions;

export default authSlice.reducer;
