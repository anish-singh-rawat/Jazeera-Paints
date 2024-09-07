import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

// import { fetchCustomerGroup } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const currencyList = createAsyncThunk(
  "currencyList/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = ROOT_BASE_API + "currency";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const currency = createSlice({
  name: "currency",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(currencyList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(currencyList.pending, (state, action) => {
      state.isLoading = true;
    });
  },
});

export default currency.reducer;
