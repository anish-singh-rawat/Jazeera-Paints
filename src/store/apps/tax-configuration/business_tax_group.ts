import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const businessTaxGroupSearch = createAsyncThunk(
  "businessTaxGroup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "businesstaxgroups/search", data);
    const response = await axios.get(
      "taxgroups?taxGroupType=BUSINESS_TAX_GROUP"
    );

    return response.data;
  }
);

export const businessTaxGroupGetById = createAsyncThunk(
  "businessTaxGroup/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "businesstaxgroups/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `businesstaxgroups/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const businessTaxGroupCreate = createAsyncThunk(
  "businessTaxGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "businesstaxgroups/save", data);
      const response = await axios.post(
        ROOT_BASE_API + "businesstaxgroups",
        data
      );

      dispatch(businessTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const businessTaxGroupUpdate = createAsyncThunk(
  "businessTaxGroup/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "businesstaxgroups/update", data);
      const response = await axios.patch(
        ROOT_BASE_API + "businesstaxgroups",
        data
      );

      dispatch(businessTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const businessTaxGroupDelete = createAsyncThunk(
  "businessTaxGroup/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "businesstaxgroups/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `businesstaxgroups/${data.id}`
      );

      dispatch(businessTaxGroupSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const businessTaxGroupToggle = createAsyncThunk(
  "businessTaxGroup/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "businesstaxgroups/toggle",
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
  message: any;
  isLoading: any;
  toggleMessage: any;
}

export const businessTaxGroup = createSlice({
  name: "businessTaxGroup",
  initialState: {
    data: [],
    message: [],
    isLoading: [],
    toggleMessage: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(businessTaxGroupSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(businessTaxGroupSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(businessTaxGroupDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      // state.loading = false;
    });
    builder.addCase(businessTaxGroupToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default businessTaxGroup.reducer;
