import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ROOT_BASE_API } from "..";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getProductCategory = createAsyncThunk(
  "Productcategory/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "Productcategory");

    return response.data;
  }
);

export const ProductcategoryGetById = createAsyncThunk(
  "Productcategory/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `Productcategory/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductcategoryCreate = createAsyncThunk(
  "Productcategory/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "Productcategory",
        data
      );

      dispatch(getProductCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const Imagefileuploader = createAsyncThunk(
  "fileupload/signed-url",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "fileupload/signed-url",
        data
      );

      //dispatch(getProductCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductcategoryUpdate = createAsyncThunk(
  "Productcategory/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "Productcategory",
        data
      );

      dispatch(getProductCategory({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductcategoryDelete = createAsyncThunk(
  "Productcategory/deleteItem",
  async (data: any, { dispatch, getState }: Redux) => {
    try {
      const state = getState();
      const productCategory = state["productCategory"]?.data;
      if (productCategory && Array.isArray(productCategory)) {
        const filterProductCatogary = productCategory.find(
          (p) => p["id"] == data.id
        );
        if (
          filterProductCatogary?.productSubCategory &&
          Array.isArray(filterProductCatogary?.productSubCategory) &&
          filterProductCatogary?.productSubCategory?.length
        )
          return {
            error: { message: "PRODUCT_CATOGARY_ASSOCIATED" },
          };
      }
      const response = await axios.delete(
        ROOT_BASE_API + `Productcategory/${data.id}`
      );

      dispatch(getProductCategory({}));
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

export const productCategory = createSlice({
  name: "productCategory",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductCategory.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductcategoryCreate.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductcategoryCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getProductCategory.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getProductCategory.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(ProductcategoryDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      state.isLoading = false;
    });
  },
});

export default productCategory.reducer;
