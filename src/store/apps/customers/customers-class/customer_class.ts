import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { fetchCustomerClass } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const customerClassSearch = createAsyncThunk(
  "customerClass/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "customerclass/search", data);
    const response = await axios.get(ROOT_BASE_API + "customerclass");

    return response.data;
  }
);

export const customerClassGetById = createAsyncThunk(
  "customerClass/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "customerclass/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `customerclass/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerClassCreate = createAsyncThunk(
  "customerClass/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "customerclass/save", data);
      const response = await axios.post(ROOT_BASE_API + "customerclass", data);

      dispatch(customerClassSearch({}));
      dispatch(fetchCustomerClass());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerClassUpdate = createAsyncThunk(
  "customerClass/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "customerclass/update", data);
      const response = await axios.patch(ROOT_BASE_API + "customerclass", data);

      dispatch(customerClassSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerClassDelete = createAsyncThunk(
  "customerClass/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "customerclass/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `customerclass/${data.id}`
      );

      dispatch(customerClassSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerClassToggle = createAsyncThunk(
  "customerClass/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "CustomerClass/toggle",
        data
      );

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
  toggleMessage: any;
}

export const customerClass = createSlice({
  name: "customerClass",
  initialState: {
    data: [],
    isLoading: false,
    error: [],
    message: [],
    toggleMessage: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(customerClassSearch.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(customerClassCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    
    builder.addCase(customerClassCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(customerClassSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(customerClassSearch.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(customerClassDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(customerClassToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default customerClass.reducer;
