import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const productTaxGroupSearch = createAsyncThunk(
  "productTaxGroup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "producttaxgroups/search", data);
    const response = await axios.get(
      "taxgroups?taxGroupType=PRODUCT_TAX_GROUP"
    );

    return response.data;
  }
);

export const productTaxGroupGetById = createAsyncThunk(
  "productTaxGroup/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "producttaxgroups/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `producttaxgroups/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productTaxGroupCreate = createAsyncThunk(
  "productTaxGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "producttaxgroups/save", data);
      const response = await axios.post(
        ROOT_BASE_API + "producttaxgroups",
        data
      );

      dispatch(productTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productTaxGroupUpdate = createAsyncThunk(
  "productTaxGroup/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "producttaxgroups/update", data);
      const response = await axios.patch(
        ROOT_BASE_API + "producttaxgroups",
        data
      );

      dispatch(productTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productTaxGroupDelete = createAsyncThunk(
  "productTaxGroup/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "producttaxgroups/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `producttaxgroups/${data.id}`
      );

      dispatch(productTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productTaxGroupToggle = createAsyncThunk(
  "productTaxGroup/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "producttaxgroups/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Stro {
  data: Array<{}>;
  isLoading: boolean;
  error: any;
  message: any;
  toggleMessage: any;
}

export const productTaxGroup = createSlice({
  name: "productTaxGroup",
  initialState: {
    data: [],
    isLoading: false,
    error: [],
    message: [],
    toggleMessage: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productTaxGroupSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(productTaxGroupSearch.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(productTaxGroupDelete.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(productTaxGroupDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      // state.isLoading = false;
    });
    builder.addCase(productTaxGroupToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default productTaxGroup.reducer;
