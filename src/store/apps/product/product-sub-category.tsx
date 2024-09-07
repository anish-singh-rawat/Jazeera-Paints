import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getProductSubCategory = createAsyncThunk(
  "ProductSubcategory/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "Productsubcategory");

    return response.data;
  }
);

export const ProductSubcategoryGetById = createAsyncThunk(
  "ProductSubcategory/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `Productsubcategory/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductSubcategoryCreate = createAsyncThunk(
  "ProductSubcategory/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "Productsubcategory",
        data
      );

      dispatch(getProductSubCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductSubcategoryUpdate = createAsyncThunk(
  "Productcategory/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "Productsubcategory",
        data
      );

      dispatch(getProductSubCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductSubcategoryDelete = createAsyncThunk(
  "Productcategory/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `Productsubcategory/${data.id}`
      );

      dispatch(getProductSubCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductSubcategoryBySearch = createAsyncThunk(
  "Productcategory/searchParam",
  async (id: any) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `Productsubcategory?searchItem=${id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Stro {
  data: Array<{}>;
  error: any;
  message: any;
  isLoading: boolean;
}

export const Productsubcategory = createSlice({
  name: "Productsubcategory",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductSubCategory.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductSubcategoryCreate.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductSubcategoryCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getProductSubCategory.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getProductSubCategory.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(ProductSubcategoryDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      state.isLoading = false;
    });
  },
});

export default Productsubcategory.reducer;
