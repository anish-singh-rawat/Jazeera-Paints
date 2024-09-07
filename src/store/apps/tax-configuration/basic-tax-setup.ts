import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const basicTaxSearch = createAsyncThunk(
  "basicTaxSetup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "BasicTax");

    return response.data;
  }
);

export const basicTaxGetById = createAsyncThunk(
  "basicTaxSetup/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `BasicTax/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const basicTaxCreate = createAsyncThunk(
  "basicTaxSetup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "BasicTax",
        data
      );

      dispatch(basicTaxSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const basicTaxUpdate = createAsyncThunk(
  "basicTaxSetup/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "BasicTax",
        data
      );

      dispatch(basicTaxSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const basicTaxDelete = createAsyncThunk(
  "basicTaxSetup/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `BasicTax/${data.id}`
      );

      dispatch(basicTaxSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const taxTypeLookup = createAsyncThunk(
  "basicTaxSetup/taxTypeLookup",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=TAX_TYPES"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  taxType: [];
  message: any;
  isLoading: any;
}

export const basicTaxSetup = createSlice({
  name: "basicTaxSetup",
  initialState: { data: [], taxType: [], message: [], isLoading: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(basicTaxSearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(basicTaxSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(basicTaxCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(basicTaxCreate.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(basicTaxUpdate.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(basicTaxCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(taxTypeLookup.fulfilled, (state, action) => {
      state.taxType = action?.payload?.data;
    });
    builder.addCase(basicTaxDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default basicTaxSetup.reducer;
