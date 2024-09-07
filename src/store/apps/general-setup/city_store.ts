import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const citySearch = createAsyncThunk(
  "city/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl =
      data.data === "all"
        ? ROOT_BASE_API + "city"
        : ROOT_BASE_API + "city?active=true";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export const cityGetById = createAsyncThunk(
  "city/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(ROOT_BASE_API + `city/${data.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const cityCreate = createAsyncThunk(
  "city/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "city", data);

      dispatch(citySearch({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const cityUpdate = createAsyncThunk(
  "city/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "city", data);

      dispatch(citySearch({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const cityDelete = createAsyncThunk(
  "city/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(ROOT_BASE_API + `city/${data.id}`);

      dispatch(citySearch({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const cityToggle = createAsyncThunk(
  "city/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "city/toggle", data);
      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const countryList = createAsyncThunk(
  "countryList/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get("country");

    return response.data;
  }
);

export const getRegionList = createAsyncThunk(
  "region/getRegionList",
  async () => {
    try {
      const response = await axios.get(`region`);

      return response?.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  countryData: Array<{}>;
  regionData: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const globalCity = createSlice({
  name: "globalCity",
  initialState: {
    data: [],
    countryData: [],
    regionData: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(citySearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(citySearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(cityCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(cityCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(cityDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(cityToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
    builder.addCase(countryList.fulfilled, (state, action) => {
      state.countryData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getRegionList.fulfilled, (state, action) => {
      state.regionData = action.payload.data;
      state.isLoading = false;
    });
  },
});

export default globalCity.reducer;
