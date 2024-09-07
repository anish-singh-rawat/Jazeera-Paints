import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ROOT_BASE_API } from "..";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getProductType = createAsyncThunk(
  "ProductTypes/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "ProductTypes");

    return response.data;
  }
);

export const getProductTypeGetById = createAsyncThunk(
  "ProductTypes/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `ProductTypes/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductTypeCreate = createAsyncThunk(
  "ProductTypes/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "ProductTypes", data);

      dispatch(getProductType({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductTypeCreateUpdate = createAsyncThunk(
  "ProductTypes/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "ProductTypes", data);

      dispatch(getProductType({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductTypeCreateDelete = createAsyncThunk(
  "ProductTypes/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `ProductTypes/${data.id}`
      );

      dispatch(getProductType({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  isLoading: boolean;
  error: any;
  message: any;
}

export const ProductTypes = createSlice({
  name: "ProductTypes",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductType.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductTypeCreate.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductTypeCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getProductType.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getProductType.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(ProductTypeCreateDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      state.isLoading = false;
    });
  },
});

export default ProductTypes.reducer;
