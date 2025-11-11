import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookies";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });
      setCookie("token", response.data.access_token, 1);
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);
      toast.success("Registration successful! Please login.");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/forgot-password", { email });

      setCookie("reset_email", email, 1); 
      toast.success("OTP sent to your email!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Forgot password request failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const VerifyOTP = createAsyncThunk(
  "user/verifyotp",
  async ({ OTP }, { rejectWithValue}) => {
    try{
      const email = getCookie("reset_email");
      const response = await api.post("/verify-otp", { email, otp: OTP });

      setCookie("otp", OTP, 1/1440 *10); // Store OTP in cookie for 1 min
      toast.success("OTP Verified");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "OTP Verification Failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const ResetPassword = createAsyncThunk(
  "user/resetpassword",
  async ({ password }, { rejectWithValue}) => {
    try{
      const email = getCookie("reset_email");
      const otp = getCookie("otp");
      const response = await api.post("/reset-password", { email, otp, new_password: password });

      toast.success("Password Reset Successful");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Reset password request failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

// Async thunk for getting current user
export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.put("/me", updateData);
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Update failed");
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: getCookie("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      deleteCookie("token");
      toast.info("Logged out successfully");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(VerifyOTP.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VerifyOTP.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(VerifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      })
      .addCase(ResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ResetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If token is invalid, clear it
        if (action.payload === "Invalid token") {
          state.token = null;
          deleteCookie("token");
        }
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
