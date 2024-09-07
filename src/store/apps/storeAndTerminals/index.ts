import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

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

export const getStoreAndTerminals = createAsyncThunk(
  "storeAndTerminals/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get("stores/storeterminals");

    return response.data;
  }
);


export const storeAndTerminals = createSlice({
  name: "storeAndTerminals",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
      builder.addCase(getStoreAndTerminals.fulfilled, (state, action) => {
          state.data = action.payload.data;
          state.isLoading = false;
      });
      builder.addCase(getStoreAndTerminals.pending, (state, action) => {
          state.isLoading = false;
      });
  },
});

export default storeAndTerminals.reducer;
