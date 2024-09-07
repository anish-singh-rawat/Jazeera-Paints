import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const markValueCreate = createAsyncThunk(
  "markUpConfiguration/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "pricelist/markupdown",
        data
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  taxType: [];
  message: any;
  isLoading: any;
}

export const markUpConfiguration = createSlice({
  name: "markUpConfiguration",
  initialState: { data: [], taxType: [], message: [], isLoading: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(markValueCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(markValueCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default markUpConfiguration.reducer;
