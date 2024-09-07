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

export const productDivisionSearch = createAsyncThunk(
  "productsDivision/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "productdivision/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "productdivisions");

    return response.data;
  }
);

export const productDivisionCreate = createAsyncThunk(
  "productsDivision/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productdivisions/save", data);
      const response = await axios.post(
        ROOT_BASE_API + "productdivisions",
        data
      );

      dispatch(productDivisionSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productDivisionUpdate = createAsyncThunk(
  "productsDivision/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/update", data);
      const response = await axios.patch(
        ROOT_BASE_API + "productdivisions",
        data
      );

      dispatch(productDivisionSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productDivisionToggle = createAsyncThunk(
  "productsDivision/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/toggle", data);
      const response = await axios.patch(
        ROOT_BASE_API + "productdivisions/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productDivisionDelete = createAsyncThunk(
  "productsDivision/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `productdivisions/${data.id}`
      );

      dispatch(productDivisionSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsDivisionGetById = createAsyncThunk(
  "productsDivision/id",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `productdivisions/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productDivision = createSlice({
  name: "productsDivision",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productDivisionSearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(productDivisionSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productDivisionCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productDivisionCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productDivisionSearch.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productDivisionToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
    builder.addCase(productDivisionDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default productDivision.reducer;
