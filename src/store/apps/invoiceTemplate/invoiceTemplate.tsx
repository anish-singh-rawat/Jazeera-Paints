import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const invoiceSave = createAsyncThunk(
  "invoiceTemplate/postData",
  async (
    data: { [key: string]: number | string | any },
    { dispatch }: Redux
  ) => {
    const response = await axios.post("/Templates", data);

    return response.data;
  }
);

export const invoiceTemplate = createSlice({
  name: "invoiceTemplate",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(invoiceSave.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
  },
});

export default invoiceTemplate.reducer;
