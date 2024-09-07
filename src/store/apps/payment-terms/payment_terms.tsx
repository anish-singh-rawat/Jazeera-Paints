import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getPaymentTerms = createAsyncThunk(
  "taxconfiguration/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "paymentterms");

    return response.data;
  }
);

export const paymentGetById = createAsyncThunk(
  "taxconfiguration/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `paymentterms/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const paymentCreate = createAsyncThunk(
  "taxconfiguration/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "paymentterms", data);

      dispatch(getPaymentTerms({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const paymentUpdate = createAsyncThunk(
  "taxconfiguration/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "paymentterms", data);

      dispatch(getPaymentTerms({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const paymentDelete = createAsyncThunk(
  "taxconfiguration/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `paymentterms/${data.id}`
      );

      dispatch(getPaymentTerms({}));
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

export const paymentConfiguration = createSlice({
  name: "paymentConfiguration",
  initialState: { data: [], taxType: [], message: [], isLoading: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPaymentTerms.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPaymentTerms.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(paymentCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(paymentCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(taxTypeLookup.fulfilled, (state, action) => {
      state.taxType = action?.payload?.data;
    });
    builder.addCase(paymentDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default paymentConfiguration.reducer;
