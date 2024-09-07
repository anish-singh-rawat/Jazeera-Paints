import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { Action } from "rxjs/internal/scheduler/Action";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Stro {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const productBrandsSearch = createAsyncThunk(
  "productsBrands/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "productsBrand/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "productbrands");

    return response.data;
  }
);

export const productBrandsCreate = createAsyncThunk(
  "productsBrands/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsBrands/save", data);
      const response = await axios.post(ROOT_BASE_API + "productbrands", data);

      dispatch(productBrandsSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productBrandsUpdate = createAsyncThunk(
  "productsBrands/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsBrands/update", data);
      const response = await axios.patch(ROOT_BASE_API + "productbrands", data);

      dispatch(productBrandsSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productBrandsToggle = createAsyncThunk(
  "productsBrands/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "productbrands/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productBrandsDelete = createAsyncThunk(
  "productsBrands/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productbrands/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `productbrands/${data.id}`
      );

      dispatch(productBrandsSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productBrandsGetById = createAsyncThunk(
  "productsBrands/getBrand",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productbrands/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `productbrands/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productBrands = createSlice({
  name: "productsBrands",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productBrandsSearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(productBrandsSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productBrandsCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productBrandsCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productBrandsSearch.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productBrandsToggle.fulfilled, (state, action) => {
      state.toggleMessage = action.payload;
    });
    builder.addCase(productBrandsDelete.fulfilled, (state, action) => {
      state.message = action.payload;
    });
  },
});

export default productBrands.reducer;
