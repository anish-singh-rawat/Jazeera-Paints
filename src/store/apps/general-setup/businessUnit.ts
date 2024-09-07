import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

// import { fetchCustomerGroup } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchBusinessUnit = createAsyncThunk(
  "businessUnit/fetchBusinessUnit",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = ROOT_BASE_API + "BusinessUnits";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);
export const fetchBusinessUnitById = createAsyncThunk(
  "businessUnit/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `BusinessUnits/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const deleteBusinessUnit = createAsyncThunk(
  "businessUnit/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `BusinessUnits/${data.id}`
      );

      dispatch(fetchBusinessUnit({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const createBusinessUnit = createAsyncThunk(
  "businessUnit/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "BusinessUnits", data);

      dispatch(fetchBusinessUnit({ data: "all" }));
      //   dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const updateBusinessUnit = createAsyncThunk(
  "businessUnit/updateBusinessUnit",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "BusinessUnits", data);

      dispatch(fetchBusinessUnit({ data: "all" }));
      return response.data;
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

export const businessUnit = createSlice({
  name: "businessUnit",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessUnit.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(fetchBusinessUnit.pending, (state, action) => {
      state.isLoading = true;
    });
  },
});

export default businessUnit.reducer;
