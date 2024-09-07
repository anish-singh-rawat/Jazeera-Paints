import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";
import { Status } from "./price-status";

export const getPricetype = createAsyncThunk("PriceType", async () => {
  const response = await axios.get(
    ROOT_BASE_API + "lookupvalues?lookupTypesCode=PRICE_TYPES"
  );

  return response.data;
});


interface PriceListType {
  data: Status[],
  isLoading: boolean,
  error?: string,
}
const initialState: PriceListType = {
  data: [], isLoading: false,

}

export const priceTypeList = createSlice({
  name: "priceTypeList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPricetype.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPricetype.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getPricetype.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default priceTypeList.reducer;
