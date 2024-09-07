import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const districtSearch = createAsyncThunk(
  "district/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = data.data === "all" ? ROOT_BASE_API + "district" : ROOT_BASE_API + "district?active=true";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export const districtGetById = createAsyncThunk(
  "district/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `district/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const districtCreate = createAsyncThunk(
  "district/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "district", data);

      dispatch(districtSearch({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const districtUpdate = createAsyncThunk(
  "district/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "district", data);

      dispatch(districtSearch({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const districtDelete = createAsyncThunk(
  "district/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `district/${data.id}`
      );

      dispatch(districtSearch({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const districtToggle = createAsyncThunk(
  "district/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "district/toggle",
        data
      );
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const globalDistrict = createSlice({
  name: "globalDistrict",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(districtSearch.fulfilled, (state, action) => {

      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(districtSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(districtSearch.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(districtCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(districtCreate.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(districtCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(districtDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(districtToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default globalDistrict.reducer;
