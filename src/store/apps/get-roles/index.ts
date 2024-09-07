import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ROOT_BASE_API } from "..";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getRoleData = createAsyncThunk("getRole/fetchData", async () => {
  const response = await axios.get(ROOT_BASE_API + "role");

  return response.data;
});

export interface Stro {
  data: Array<{}>;
  isLoading: boolean;
  error: any;
  message: any;
}

export const getRoles = createSlice({
  name: "getRoles",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoleData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getRoleData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getRoleData.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default getRoles.reducer;
