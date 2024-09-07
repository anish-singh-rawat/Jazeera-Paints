import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";

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

export const productFamilySearch = createAsyncThunk(
  "productsFamily/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "Productfamily/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "Productfamily");

    return response.data;
  }
);

export const productFamilyCreate = createAsyncThunk(
  "productsFamily/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productfamily/save", data);
      const response = await axios.post(ROOT_BASE_API + "Productfamily", data);

      dispatch(productFamilySearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productFamilyUpdate = createAsyncThunk(
  "productsFamily/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productfamily/update", data);
      const response = await axios.patch(ROOT_BASE_API + "Productfamily", data);

      dispatch(productFamilySearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productFamilyToggle = createAsyncThunk(
  "productsFamily/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsFamily/toggle", data);
      const response = await axios.patch(
        ROOT_BASE_API + "Productfamily/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productFamilyDelete = createAsyncThunk(
  "productsFamily/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productfamily/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `Productfamily/${data.id}`
      );

      dispatch(productFamilySearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsFamilyGetById = createAsyncThunk(
  "productsFamily/id",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsFamily/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `Productfamily/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productFamily = createSlice({
  name: "productsFamily",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productFamilySearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(productFamilySearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productFamilyCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productFamilyCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productFamilySearch.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productFamilyToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
    builder.addCase(productFamilyDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default productFamily.reducer;
