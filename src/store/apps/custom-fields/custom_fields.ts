import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// export const customFieldsSearch = createAsyncThunk(
//   "customFields/fetchData",
//   async (data: { [key: string]: number | string | any }) => {
//     const response = await axios.get(ROOT_BASE_API + "customfields");

//     return response.data;
//   }
// );

export const customFieldsSearch = createAsyncThunk(
  "customFields/fetchData",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `customfields?entityType=${data?.entityType}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customFieldsGetById = createAsyncThunk(
  "customFields/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `customfields/id?id=${data?.id}&entityType=${data?.entityType}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customFieldsCreate = createAsyncThunk(
  "customFields/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "customfields", data);
      dispatch(customFieldsSearch({ entityType: data?.entityType }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customFieldsUpdate = createAsyncThunk(
  "customFields/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "customfields", data);
      dispatch(customFieldsSearch({ entityType: data?.entityType }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customFieldsDelete = createAsyncThunk(
  "customFields/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API +
          `customfields?id=${data?.id}&entityType=${data?.entityType}`
      );
      dispatch(customFieldsSearch({ entityType: data?.entityType }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const customFieldsDataTypes = createAsyncThunk(
  "customFields/dataTypes",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `lookupvalues?lookupTypesCode=CUSTOM_FIELDS_DATA_TYPES`
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
  dataTypes: any;
}

export const customFields = createSlice({
  name: "customerDivision",
  initialState: { data: [], message: [], isLoading: [], dataTypes: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(customFieldsSearch.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(customFieldsSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customFieldsCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(customFieldsDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(customFieldsDataTypes.fulfilled, (state, action) => {
      state.dataTypes = action?.payload?.data;
    });
  },
});

export default customFields.reducer;
