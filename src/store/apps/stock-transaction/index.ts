import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { RootState } from "src/store";
import { ROOT_BASE_API } from "../";
import { formatDateToISO } from "src/utils/validationsMethods";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface StockTransactionState {
  data: any;
  message: any;
  error: any;
  isLoading: boolean;
  tilesData: {
    totaltransaction: number;
    totalshipped: number;
    totalreceived: number;
    totalreturn: number;
    totalinvoiced: number;
  };
}

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
  storeId?: number;
  startDate?: string | any;
  endDate?: string | any;
}

export const getstockTransaction = createAsyncThunk<
  any, // Define the type of the returned data
  IPaginate, // Define the type of the payload creator arguments
  { dispatch: Dispatch; signal: AbortSignal; state: RootState } // Define the type of the extra argument
>(
  "stockTransaction/fetchData",
  async (
    { skip = 0, limit = 10, storeId, startDate, endDate, search }: IPaginate,
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI;
    const response = await axios.get(ROOT_BASE_API + "StockTransactions", {
      params: {
        skip,
        limit,
        storeId,
        ...(search && { searchItem: search }),
        ...(startDate && { startDate: formatDateToISO(startDate) }),
        ...(endDate && { endDate: formatDateToISO(endDate) }),
      },
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

//   const response = await axios.get(url);
//     //   return response.data;
//     }
//   );

export const stockTransactionsTiles = createAsyncThunk(
  "stockTransactions/fetchDataTiles",
  async ({ storeId }: IPaginate, thunkAPI) => {
    const response = await axios.get("StockTransactions/tiles", {
      params: {
        storeId,
      },
    });

    return response.data;
  }
);

export const stocktransactionSlice = createSlice({
  name: "stockTransaction",
  initialState: {
    data: [],
    isLoading: false,
    tilesData: {
      totaltransaction: NaN,
      totalshipped: NaN,
      totalreceived: NaN,
      totalreturn: NaN,
      totalinvoiced: NaN,
    },
    error: [],
    message: [],
  } as StockTransactionState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getstockTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getstockTransaction.fulfilled, (state, action) => {
        state.data = action.payload; // Assuming the API directly returns the array of stock data
        state.isLoading = false;
      })
      .addCase(getstockTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error; // Capture and store any error if the action fails
      })
      .addCase(stockTransactionsTiles.fulfilled, (state, action) => {
        state.tilesData = action.payload;
      });
  },
});

export default stocktransactionSlice.reducer;
