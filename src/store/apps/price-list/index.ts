import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

export type ProductPrice = {
  price: number;
  UOMId: string | number; // Assuming it's a string, replace it with the actual type if different
  sku: number;
  minimumPrice: number;
  productId: number;
  isTaxesIncluded: boolean;
  startDate: string;
  endDate: string;
  active: boolean;
  conversion: boolean;
  status: boolean;
};

export type FormData = {
  code: string;
  name: string;
  altName: string;
  externalReference: string;
  currencyId: number | null;
  priceType: string | null; // Change the type accordingly
  status: string | null; // Change the type accordingly
  active: boolean;
  companyId: number;
  tenantId: number;
  productPrice: ProductPrice[];
};

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Stro {
  data: any;
  message: any;
  error: any;
  isLoading: any;
}

export const getPriceCreation = createAsyncThunk(
  "priceCreation/fetchData",
  async () => {
    const response = await axios.get("/pricelist");
    return response.data;
  }
);

export const createPrice = createAsyncThunk(
  "priceCreation/postData",
  async (data: FormData, { dispatch }: Redux) => {
    const response = await axios.post("pricelist", data);
    return response.data;
  }
);

export type updatePriceList = FormData & {
  id: number;
  companyId: number;
  tenantId: number;
};

export const priceUpdate = createAsyncThunk(
  "user/update",
  async (data: updatePriceList, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("pricelist", data);

      dispatch(getPriceCreation());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getPriceListByID = createAsyncThunk(
  "price/createPriceById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`pricelist/${data}`);

      return response.data;
    } catch (e: any) {
      console.log(e, data);
    }
  }
);

export const PriceCreation = createSlice({
  name: "productsDivision",
  initialState: {
    data: [],
    isLoading: false,
    error: [],
    message: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPriceCreation.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getPriceCreation.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getPriceCreation.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});
export default PriceCreation.reducer;
