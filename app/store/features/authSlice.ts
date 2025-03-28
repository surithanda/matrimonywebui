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

interface ResetPasswordPayload {
  history_id: number;
  otp: string;
  new_password: string;
  confirm_new_password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

interface LoginResponse {
  history_id: number;
  token?: string;
  user?: {
    full_name: string;
    email: string;
    // ...other user properties
  };
}

interface AccountDetailsResponse {
  success: boolean;
  data: {
    account_id: number;
    account_code: string;
    email: string;
    primary_phone: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    birth_date: string;
    gender: number;
    address_line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface AuthState {
  loginData: LoginPayload;
  otpData: OtpPayload | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginResponse: LoginResponse | null;
  userData: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    gender?: string;
    secondary_phone?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    account_code?: string;
    account_id?: number;
  } | null;
  forgotPasswordhistory_id: number;
}

const initialState: any = {
  loginData: {
    email: '',
    password: '',
  },
  otpData: null,
  token: null,
  loading: false,
  error: null,
  loginResponse: null,
  userData: null,
  forgotPasswordhistory_id: 0,
};

// Async thunk for logging in
export const loginUserAsync = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', payload);
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
      const response = await api.post('/auth/verify-otp', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/change-password', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: ForgotPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Forgot password failed');
    }
  }
);

export const fetchAccountDetailsAsync = createAsyncThunk(
  'auth/fetchAccountDetails',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/account/${email}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch account details');
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
    setLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      state.loginResponse = action.payload;
    },
    setUser: (state, action: PayloadAction<typeof initialState.userData>) => {
      state.userData = action.payload;
    },
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
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.loginResponse = action.payload;
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordhistory_id = action.payload.history_id;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAccountDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.data;
      })
      .addCase(fetchAccountDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setLoginData, resetAuthState, setLoginResponse, setUser } = authSlice.actions;

export default authSlice.reducer;
