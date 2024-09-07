import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";



export const getProductData = createAsyncThunk(
  "getRole/fetchProducts",
  async (query, thunkAPI) => {
    const response = await axios.get(ROOT_BASE_API + `Products`, {
      params: {
        appType: "admin",
        skip: 0,
        limit: 10,
        ...(typeof query == "object" ? query : {}),
      },
      signal: thunkAPI.signal
    });
    return response.data;
  }
);


export const fetchMoreProduct = createAsyncThunk(
  "getRole/fetchMoreProducts",
  async (query, thunkAPI) => {
    const response = await axios.get(ROOT_BASE_API + `Products`, {
      params: {
        appType: "admin",
        skip: 0,
        limit: 10,
        ...(typeof query == "object" ? query : {}),
      },
      signal: thunkAPI.signal
    });
    return response.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "getRole/fetchAllProducts",
  async (query, thunkAPI) => {
    const response = await axios.get(ROOT_BASE_API + `Products`, {
      params: {
        appType: "admin",
        ...(typeof query == "object" ? query : {}),
      },
      signal: thunkAPI.signal
    });
    return response.data;
  }
);


export interface Stro {
  data: Array<{}>;
  isLoading: boolean;
  error: any;
  message: any;
  isMoreProductLoading: boolean;
  filterdData: [] | null;
  ProductCount:number;
}

export const getProductSlice = createSlice({
  name: "getProductSlice",
  initialState: { data: [], isLoading: false, error: [], message: [], isMoreProductLoading: false, filterdData: null , ProductCount:0} as Stro,
  reducers: {
    setFilteredResult(state, action) {
      state.filterdData = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProductData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getProductData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.ProductCount = action.payload.totalCount
      state.isLoading = false;
    });

    builder.addCase(getProductData.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(fetchMoreProduct.pending, (state, action) => {
      state.isMoreProductLoading = true;
    });

    builder.addCase(fetchMoreProduct.fulfilled, (state, action) => {
      state.data = action.payload?.data ;
      state.ProductCount = action.payload.totalCount
      state.isMoreProductLoading = false;
    });

    builder.addCase(fetchMoreProduct.rejected, (state, action) => {
      state.error = action.error.message;
      state.isMoreProductLoading = false;
    });
  },
});

export const { setFilteredResult } = getProductSlice.actions
export default getProductSlice.reducer;
