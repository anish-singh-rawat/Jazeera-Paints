import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { fetchCustomerDivision } from "../../customers";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const customerDivisionSearch = createAsyncThunk(
  "customerDivision/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = data.data === "all" ? ROOT_BASE_API + "customerdivision" : ROOT_BASE_API + "customerdivision?active=true";
    const response = await axios.get(apiUrl);
    return response.data;
  }
);

export const customerDivisionGetById = createAsyncThunk(
  "customerDivision/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `customerdivision/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerDivisionCreate = createAsyncThunk(
  "customerDivision/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "customerdivision",
        data
      );
      dispatch(customerDivisionSearch({data:"all"}));
      dispatch(fetchCustomerDivision());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerDivisionUpdate = createAsyncThunk(
  "customerDivision/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "customerdivision",
        data
      );
      dispatch(customerDivisionSearch({data:"all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerDivisionDelete = createAsyncThunk(
  "customerDivision/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `customerdivision/${data.id}`
      );
      dispatch(customerDivisionSearch({data:"all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerDivisionToggle = createAsyncThunk(
  "customerDivision/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "CustomerDivision/toggle",
        data
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  isLoading: any;
  toggleMessage: any;
}

export const customerDivision = createSlice({
  name: "customerDivision",
  initialState: {
    data: [],
    message: [],
    isLoading: [],
    toggleMessage: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(customerDivisionSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(customerDivisionSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customerDivisionCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customerDivisionCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(customerDivisionDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(customerDivisionToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default customerDivision.reducer;
