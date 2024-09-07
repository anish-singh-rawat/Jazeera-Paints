import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const taxConfigurationSearch = createAsyncThunk(
  "taxconfiguration/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "taxconfigurations/search", data);
    const response = await axios.get(ROOT_BASE_API + "taxconfigurations");

    return response.data;
  }
);

export const taxConfigurationGetById = createAsyncThunk(
  "taxconfiguration/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "taxconfigurations/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `taxconfigurations/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const taxConfigurationCreate = createAsyncThunk(
  "taxconfiguration/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "taxconfigurations/save", data);
      const response = await axios.post(
        ROOT_BASE_API + "taxconfigurations",
        data
      );

      dispatch(taxConfigurationSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const taxConfigurationUpdate = createAsyncThunk(
  "taxconfiguration/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "taxconfigurations/update", data);
      const response = await axios.patch(
        ROOT_BASE_API + "taxconfigurations",
        data
      );

      dispatch(taxConfigurationSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const taxConfigurationDelete = createAsyncThunk(
  "taxconfiguration/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "taxconfigurations/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `taxconfigurations/${data.id}`
      );

      dispatch(taxConfigurationSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const taxTypeLookup = createAsyncThunk(
  "taxconfiguration/taxTypeLookup",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "lookupvalues/search", data);
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=TAX_TYPES"
      );

      // dispatch(taxConfigurationSearch({}))
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Stro {
  data: Array<{}>;
  taxType: [];
  message: any;
  isLoading: any;
}

export const taxConfiguration = createSlice({
  name: "taxconfiguration",
  initialState: { data: [], taxType: [], message: [], isLoading: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(taxConfigurationSearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(taxConfigurationSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(taxTypeLookup.fulfilled, (state, action) => {
      state.taxType = action?.payload?.data;
    });
    builder.addCase(taxConfigurationDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default taxConfiguration.reducer;
