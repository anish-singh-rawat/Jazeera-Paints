import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
}

export const getPriceListData = createAsyncThunk(
  "priceList/fetchData",
  async ({ skip = 0, limit = 10, search }: IPaginate, thunkAPI) => {
    const response = await axios.get(ROOT_BASE_API + "pricelist", {
      params: {
        skip,
        limit,
        ...(search && { searchItem:search })
      },
      signal:thunkAPI.signal
    });

    return response.data;
  }
);

export const getPriceListDelete = createAsyncThunk(
  "productsDivision/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `pricelist/${data.id}`
      );

      dispatch(getPriceListData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);


export interface Stro {
  data: Array<{}>;
  isLoading: boolean;
  error: any;
  message: any;
  totalCount: number;
}

export const priceListData = createSlice({
  name: "priceListData",
  initialState: { data: [], isLoading: false, error: [], message: [], totalCount: 0 } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPriceListData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPriceListData.fulfilled, (state, action) => {
      state.data = action.payload?.data;
      state.totalCount = action.payload?.totalCount
      state.isLoading = false;
    });

    builder.addCase(getPriceListData.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default priceListData.reducer;
