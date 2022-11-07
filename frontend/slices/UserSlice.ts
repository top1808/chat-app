/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from '../api/userApi';
import { Auth } from '../models/Auth';
import { User } from '../models/User';

export interface InitialState {
  status: 'idle' | 'loading' | 'completed' | 'failed';
  data: Array<User>;
}

const initialState: InitialState = {
  status: 'idle',
  data: [],
};

export const getAllUser = createAsyncThunk(
  'user/getAllUser',
  async (params: Auth, { rejectWithValue }) => {
    try {
      const res = await userApi.getAll(params);
      return res;
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(err.message);
    }
  }
);

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getAllUser.fulfilled, (state, actions) => {
      state.status = 'completed';
      state.data = actions.payload;
    });
    builder.addCase(getAllUser.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export default UserSlice.reducer;
