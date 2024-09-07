import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { fetchCustomerGroup } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const customerGroupSearch = createAsyncThunk(
  "customerGroup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = data.data === "all" ? ROOT_BASE_API + "customergroup" : ROOT_BASE_API + "customergroup?active=true";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export const customerGroupGetById = createAsyncThunk(
  "customerGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `customergroup/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerGroupCreate = createAsyncThunk(
  "customerGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "customergroup", data);

      dispatch(customerGroupSearch({data: "all"}));
      dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerGroupUpdate = createAsyncThunk(
  "customerGroup/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "customergroup", data);

      dispatch(customerGroupSearch({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerGroupDelete = createAsyncThunk(
  "customerGroup/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `customergroup/${data.id}`
      );

      dispatch(customerGroupSearch({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customerGroupToggle = createAsyncThunk(
  "customerGroup/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "CustomerGroup/toggle",
        data
      );
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const customerGroup = createSlice({
  name: "customerGroup",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(customerGroupSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(customerGroupSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customerGroupCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customerGroupCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(customerGroupDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(customerGroupToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default customerGroup.reducer;
