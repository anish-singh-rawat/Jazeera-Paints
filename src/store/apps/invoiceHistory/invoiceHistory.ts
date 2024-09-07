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
}

export interface Store {
  data: Array<{}>;
  tilesData: {
    totalSales: number;
    totalReturns: number;
    totalNetSales: number;
  };
  message: any;
  toggleMessage: any;
  isLoading: any;
  searchData: Array<{}>;
  byProductSearchData: Array<{}>;
  totalCount: Array<{}>;
  storeFilterData: Array<{}>;
  invoiceDetailsById: Array<{}>;
  response: Array<{}>;
}

export const invoiceHistoryList = createAsyncThunk(
  "invoiceHistory/fetchData",
  async (
    { skip = 0, limit = 10, search, storeId, startDate, endDate }: IPaginate,
    thunkAPI
  ) => {
    const params: any = {
      skip,
      limit,
      ...(storeId && { storeId: storeId }),
      ...(search && { searchItem: search }),
      ...(startDate && { startDate: formatDateToISOWithTime(startDate) }),
      ...(endDate && { endDate: formatDateToISOWithTime(endDate, true) }),
    };

    const response = await axios.get(ROOT_BASE_API + "SalesInvoiceHeader/web", {
      params,
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

export const invoiceHistoryTiles = createAsyncThunk(
  "invoiceHistory/fetchDataTiles",
  async (data = {}) => {
    const { storeId, startDate, endDate } = data;
    const params: any = {
      ...(storeId && { storeId: storeId }),
      ...(startDate && { startDate: formatDateToISOWithTime(startDate) }),
      ...(endDate && { endDate: formatDateToISOWithTime(endDate, true) }),
    };
    const response = await axios.get("SalesInvoiceHeader/tiles", { params });

    return response.data;
  }
);

export const getInvoiceHistoryById = createAsyncThunk(
  "invoiceHistory/fetchDataById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`SalesInvoiceHeader/${data.id}`);

      return response.data;
    } catch (e: any) {
      console.log(e, data);
    }
  }
);

export const invoiceEmail = createAsyncThunk(
  "invoiceHistory/invoiceEmail",
  async (data: any, { dispatch }: Redux) => {
    const response = await axios.post("SalesInvoiceHeader/invoiceemail", data);
    return response.data;
  }
);

export const downloadInvoice = createAsyncThunk(
  "invoiceHistory/downloadInvoice",
  async (data: any, { dispatch }: Redux) => {
    const response = await axios.post(
      "SalesInvoiceHeader/downloadinvoice",
      data
    );
    return response.data;
  }
);

export const invoiceHistory = createSlice({
  name: "invoiceHistory",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    tilesData: {
      totalSales: NaN,
      totalReturns: NaN,
      totalNetSales: NaN,
    },
    searchData: [],
    totalCount: [],
    byProductSearchData: [],
    storeFilterData: [],
    invoiceDetailsById: [],
    additionalParams: {},
    response: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(invoiceHistoryList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalCount = action.payload?.totalCount;
      state.isLoading = false;
    });
    builder.addCase(invoiceHistoryTiles.fulfilled, (state, action) => {
      state.tilesData = action.payload;
    });
    builder.addCase(invoiceHistoryList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(invoiceHistoryList.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(getInvoiceHistoryById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getInvoiceHistoryById.fulfilled, (state, action) => {
      state.invoiceDetailsById = action.payload;
    });
    builder.addCase(invoiceEmail.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(invoiceEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.response = action.payload;
    });
    builder.addCase(downloadInvoice.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(downloadInvoice.fulfilled, (state, action) => {
      state.isLoading = false;
      state.response = action.payload;
    });
  },
});

export default invoiceHistory.reducer;
