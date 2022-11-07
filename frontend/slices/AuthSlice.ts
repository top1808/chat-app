/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import authApi from '../api/authApi';
import { Auth } from '../models/Auth';
import { User } from '../models/User';

export interface InitialState {
  status: 'idle' | 'loading' | 'completed' | 'failed';
  data: Auth;
}

const initialState: InitialState = {
  status: 'idle',
  data: {
    accessToken: '',
    user: null,
  },
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (body: User, { rejectWithValue }) => {
    try {
      const data = await authApi.register(body);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (body: User, { rejectWithValue }) => {
    try {
      const data = await authApi.login(body);
      return data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (params: object) => {
    const data = await authApi.logout(params);
    return data;
  }
);

export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
  const data = await authApi.refreshToken();
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = 'completed';
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.status = 'failed';
    });
    //Login
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loginUser.fulfilled, (state, actions) => {
      state.status = 'completed';
      state.data = actions.payload;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.status = 'failed';
    });
    //Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = 'completed';
      state.data = {
        accessToken: '',
        user: null,
      };
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.status = 'failed';
    });
    //refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(refreshToken.fulfilled, (state, actions) => {
      state.status = 'completed';
      state.data = {
        ...state.data,
        accessToken: actions.payload.data.newAccessToken,
      };
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export default authSlice.reducer;
