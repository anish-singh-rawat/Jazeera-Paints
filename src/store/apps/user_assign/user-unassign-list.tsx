//users/unassignedusers

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getUserunassigned = createAsyncThunk(
  "getUserunassigned",
  async (data: any) => {
    const response = await axios.get(
      ROOT_BASE_API + `users/unassignedusers?roleId=${data}`
    );

    return response.data;
  }
);

export interface Stro {
  data: Array<{}>;
  error: any;
  message: any;
  isLoading: boolean;
}

export const UserUnAssigned = createSlice({
  name: "getUserunassigned",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserunassigned.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserunassigned.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getUserunassigned.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default UserUnAssigned.reducer;
