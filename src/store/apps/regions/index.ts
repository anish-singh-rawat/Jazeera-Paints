import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { axiosInstance } from "src/configs/axios";
interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getRegionList = createAsyncThunk(
  "region/getRegionList",
  async () => {
    try {
      const response = await axiosInstance.get(`region`);
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getRegionListById = createAsyncThunk(
  "region/getRegionListById",
  async ({id}:any) => {
    try {
      const response = await axiosInstance.get(`region/${id}`);
      return response?.data;
    } catch (e: any) {
      console.log(e, id);
    }
  }
);

export const deleteRegionListById = createAsyncThunk(
  "region/deleteRegionListById",
  async ({id}:any, {dispatch}) => {
    try {
      const response = await axiosInstance.delete(`region/${id}`);
      dispatch(getRegionList())
      return response?.data;
    } catch (e: any) {
      console.log(e, id);
    }
  }
);

export const createNewRegion = createAsyncThunk(
  "region/createNewRegion",
  async (payload: Record<string, any>,{dispatch}) => {
    try {
      const response = await axiosInstance.post(`region`, payload);
      dispatch(getRegionList())
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const patchRegion = createAsyncThunk(
  "region/patchRegion",
  async (payload: Record<string, any>, {dispatch}) => {
    try {
      const response = await axiosInstance.patch(`region`, payload);
      dispatch(getRegionList())
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: [];
  message: string;
  error: any;
  isLoading: boolean;
}

export const regions = createSlice({
  name: "regions",
  initialState: {
    data: [],
    isLoading: false,
    error: [],
    message: "",
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRegionList.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getRegionList.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getRegionList.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
export default regions.reducer;
