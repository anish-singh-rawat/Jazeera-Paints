import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";
import {
  formatDateToISO,
  formatDateToISOWithTime,
} from "src/utils/validationsMethods";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
  storeId?: number | any;
  startDate?: string | any;
  endDate?: string | any;
  orderStatus?: string | any;
}

export interface Store {
  data: Array<{}>;
  tilesData: {
    totalOnline: number;
    totalLocal: number;
    totalOutlet: number;
  };
  message: any;
  toggleMessage: any;
  isLoading: any;
  searchData: Array<{}>;
  byProductSearchData: Array<{}>;
  totalCount: Array<{}>;
  storeFilterData: Array<{}>;
  orderDetailsById: Array<{}>;
  response: Array<{}>;
}

export const orderHistoryList = createAsyncThunk(
  "orderHistory/fetchData",
  async (
    {
      skip = 0,
      limit = 10,
      orderStatus,
      search,
      storeId,
      startDate,
      endDate,
    }: IPaginate,
    thunkAPI
  ) => {
    const params: any = {
      skip,
      limit,
      ...(orderStatus && { orderStatus: orderStatus }),
      ...(storeId && { storeId: storeId }),
      ...(search && { searchItem: search }),
      ...(startDate && { startDate: formatDateToISOWithTime(startDate) }),
      ...(endDate && { endDate: formatDateToISOWithTime(endDate, true) }),
    };

    const response = await axios.get(ROOT_BASE_API + "SalesOrderHeader", {
      params,
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

export const orderHistoryTiles = createAsyncThunk(
  "orderHistory/fetchDataTiles",
  async (data = {}) => {
    const { storeId, startDate, endDate } = data;
    const params: any = {
      ...(storeId && { storeId: storeId }),
      ...(startDate && { startDate: formatDateToISOWithTime(startDate) }),
      ...(endDate && { endDate: formatDateToISOWithTime(endDate, true) }),
    };
    const response = await axios.get("SalesOrderHeader/tiles", { params });

    return response.data;
  }
);

export const getOrderHistoryById = createAsyncThunk(
  "orderHistory/fetchDataById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`SalesOrderHeader/${data.id}`);

      return response.data;
    } catch (e: any) {
      console.log(e, data);
    }
  }
);

export const orderHistory = createSlice({
  name: "orderHistory",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    tilesData: {
      totalOnline: NaN,
      totalLocal: NaN,
      totalOutlet: NaN,
    },
    searchData: [],
    totalCount: [],
    byProductSearchData: [],
    storeFilterData: [],
    orderDetailsById: [],
    additionalParams: {},
    response: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(orderHistoryList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalCount = action.payload?.totalCount;
      state.isLoading = false;
    });
    builder.addCase(orderHistoryTiles.fulfilled, (state, action) => {
      state.tilesData = action.payload;
    });
    builder.addCase(orderHistoryList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(orderHistoryList.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(getOrderHistoryById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderHistoryById.fulfilled, (state, action) => {
      state.orderDetailsById = action.payload;
    });
  },
});

export default orderHistory.reducer;
