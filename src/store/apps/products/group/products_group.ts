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

export const productGroupSearch = createAsyncThunk(
  "productsGroup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get(ROOT_BASE_API + "Productgroups");

    return response.data;
  }
);

export const productGroupCreate = createAsyncThunk(
  "productsGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productgroups/save", data);
      const response = await axios.post(ROOT_BASE_API + "Productgroups", data);

      dispatch(productGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productGroupUpdate = createAsyncThunk(
  "productsGroup/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsGroup/update", data);
      const response = await axios.patch(ROOT_BASE_API + "Productgroups", data);

      dispatch(productGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productGroupDelete = createAsyncThunk(
  "productsGroup/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productgroups/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `Productgroups/${data.id}`
      );

      dispatch(productGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productGroupToggle = createAsyncThunk(
  "productsGroup/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productgroups/toggle", data);
      const response = await axios.patch(
        ROOT_BASE_API + "Productgroups/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsGroupGetById = createAsyncThunk(
  "productsGroup/id",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "Productgroups/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `Productgroups/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productGroup = createSlice({
  name: "productsGroup",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productGroupSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(productGroupSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productGroupCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productGroupCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productGroupSearch.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productGroupDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(productGroupToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default productGroup.reducer;
