import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

export interface Status {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  lookupTypesCode: string;
}

export const getPriceStatus = createAsyncThunk("PriceStatus", async () => {
  const response = await axios.get(
    ROOT_BASE_API + "lookupvalues?lookupTypesCode=PRICE_STATUS"
  );

  return response.data;
});

export const getPriceCodeMapping = createAsyncThunk("fetchPriceListCode", async () => {
  const response = await axios.get(
    ROOT_BASE_API + "SequenceMapping/code?code=PRICE_LIST_CODE"
  );

  return response.data;
});


interface PriceListStatus {
  data: Status[],
  isLoading: boolean,
  error?: string,
  code: Boolean
}
const initialState: PriceListStatus = {
  data: [],
  isLoading: false,
  code: false

}

export const priceListStatus = createSlice({
  name: "priceListStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPriceStatus.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPriceStatus.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getPriceStatus.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
    builder.addCase(getPriceCodeMapping.fulfilled, (state, action) => {
      state.code = action.payload?.["autoGeneration"] || false;
    });
  },
});

export default priceListStatus.reducer;
