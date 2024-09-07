import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";
import { Dispatch } from "redux";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Stro {
  data: Array<{}>;
  message: any;
  isLoading: any;
};

export const getMarketPlacevalues = createAsyncThunk(
  "marketPlace/values",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "productsBrand/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "MarketPlace?active=true");
    return response.data;
  }
);

export const MarketPlace = createSlice({
  name: "MarketPlace",
  initialState: {
    data: [],
    message: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMarketPlacevalues.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getMarketPlacevalues.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getMarketPlacevalues.rejected, (state, action) => {
      state.isLoading = false;
    });
    
  },
});

export default MarketPlace.reducer;