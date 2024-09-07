//users/unassignedusers

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getUserassigned = createAsyncThunk(
  "getUserassigned",
  async (data: any) => {
    const response = await axios.get(ROOT_BASE_API + `users/?roleId=${data}`);

    return response.data;
  }
);

export interface Stro {
  data: Array<{}>;
  error: any;
  message: any;
  isLoading: boolean;
}

export const UserAssigned = createSlice({
  name: "getUseassigned",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(getUserassigned.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserassigned.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getUserassigned.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default UserAssigned.reducer;
