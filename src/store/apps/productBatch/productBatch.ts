import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { RootState } from 'src/store';

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Store {
  data: Array<{}>;
  tilesData: {
    totalCount: number;
    totalActiveCount: number;
    totalNearExpiry: number;
    totalExpired: number;
  };
  message: any;
  toggleMessage: any;
  isLoading: any;
  searchData: Array<{}>;
  byProductSearchData: Array<{}>;
  totalCount: Array<{}>;
}

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
  appType?: string;
}

export const productBatch = createAsyncThunk(
  "productsBatch/fetchData",
  async () => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get("ProductBatch");

    return response.data;
  }
);

// export const fetchProductsBatchListData = createAsyncThunk<
//   Array<{}> | any | Dispatch, // Define the type of the returned data
//   IPaginate, // Define the type of the payload creator arguments
//   { dispatch: Dispatch; signal: AbortSignal; state: RootState }
// >(
//   "productsBatch/fetchListData",
//   async ({ skip = 0, limit = 10, appType = "admin", search }: IPaginate, thunkAPI) => {
//     const { dispatch } = thunkAPI;
//     const response = await axios.get("ProductBatch", {
//       params: {
//         skip,
//         limit,
//         appType,
//         ...(search && { searchItem: search })
//       },
//       signal: thunkAPI.signal
//     });
//     dispatch(productBatchTiles());
//     return response.data;
//   }
// );

export const fetchProductsBatchListData = createAsyncThunk<
  any, // Define the type of the returned data
  IPaginate, // Define the type of the payload creator arguments
  { dispatch: any; signal: AbortSignal; state: RootState }
>(
  "productsBatch/fetchListData",
  async ({ skip = 0, limit = 10, appType = "admin", search }: IPaginate, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      const response = await axios.get("ProductBatch", {
        params: {
          skip,
          limit,
          appType,
          ...(search && { searchItem: search })
        },
        signal: thunkAPI.signal
      });
      
      // Dispatch productBatchTiles after fetching data
      dispatch(productBatchTiles());

      return response.data;
    } catch (error) {
      // Handle error if necessary
      throw error;
    }
  }
);

export const productBatchDelete = createAsyncThunk(
  "productsBatch/delete",
  async (id: number | string | any, { dispatch }: Redux) => {
    const response = await axios.delete(`ProductBatch/${id}`);
    dispatch(fetchProductsBatchListData({}));
    return response.data;
  }
);

export const productsBatchCreate = createAsyncThunk(
  "productsBatch/create",
  async(data:any,{dispatch}:Redux)=>{
    const res = await axios.post('ProductBatch',data);
    dispatch(fetchProductsBatchListData({}));
    return res.data
  }
);

export const productBatchAssign = createAsyncThunk(
  "productsBatch/ProductBatchMapping",
  async(data:any,{dispatch}:Redux)=>{
    const res = await axios.post('ProductBatchMapping/bulk',data);
    // dispatch(productBatchTiles());
    return res.data
  }
);

export const productBatchUpdate = createAsyncThunk(
  "productsBatch/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("ProductBatch",data);
      dispatch(fetchProductsBatchListData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsBatchGetById = createAsyncThunk("productsGet/fetchById", async (id: number | any) => {
  try {
    const response = await axios.get(`ProductBatch/${id?.id}`);

    return response.data;
  } catch (e: any) {
    console.log(e);
  }
});

export const productBatchTiles = createAsyncThunk(
  "productsBatch/fetchDataTiles",
  async () => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get("ProductBatch/tiles");

    return response.data;
  }
);

export const fetchProductBatchSearchData = createAsyncThunk(
  "productsBatch/fetchSearchData",
  async (data: { [key: string]: number | string }) => {
    let URL = `ProductBatch?skip=${data.skip}&limit=${data.limit}&searchItem=${data.searchItem}`;

    try {
      const response = await axios.get(URL);

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchProductByBatchSearchData = createAsyncThunk(
  "productsBatch/fetchByProductSearchData",
  async (data: { [key: string]: number | string }) => {
    let URL = `ProductBatchMapping?skip=${data.skip}&limit=${data.limit}&searchItem=${data.searchItem}`;
    try {
      const response = await axios.get(URL);

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productByBatchDelete = createAsyncThunk(
  "productsBatch/delete",
  async (id: number | string | any, { dispatch }: Redux) => {
    const response = await axios.delete(`ProductBatchMapping/${id}`);

    return response.data;
  }
);

export const productsBatch = createSlice({
  name: "productsBatch",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    tilesData: {
      totalCount: NaN,
      totalActiveCount: NaN,
      totalNearExpiry: NaN,
      totalExpired: NaN,
    },
    searchData: [],
    totalCount: [],
    byProductSearchData: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsBatchListData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchProductsBatchListData.fulfilled, (state, action) => {
      state.data = action.payload?.data;
      state.totalCount = action.payload?.totalCount
      state.isLoading = false;
    });

    builder.addCase(fetchProductsBatchListData.rejected, (state, action) => {
      // state.error = action.error?.message;
      state.isLoading = false;
    });
    builder.addCase(productBatch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(productBatchTiles.fulfilled, (state, action) => {
      state.tilesData = action.payload;
    });
    builder.addCase(productBatch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productsBatchCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productsBatchCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productsBatchCreate.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productBatchAssign.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productBatchAssign.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productBatch.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(fetchProductBatchSearchData.fulfilled, (state, action) => {
      state.searchData = action.payload?.data || [];
      state.totalCount = action.payload?.totalCount || [];
    });
    builder.addCase(fetchProductByBatchSearchData.fulfilled, (state, action) => {
      state.byProductSearchData = action.payload?.data || [];
    });
    
  },
});

export default productsBatch.reducer;
