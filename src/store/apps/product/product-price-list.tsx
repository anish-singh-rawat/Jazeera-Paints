import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const getProductPriceList = createAsyncThunk(
  "ProductPriceList/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "ProductPriceList?active=true");

    return response.data;
  }
);

export const ProductPriceListGetById = createAsyncThunk(
  "ProductPriceList/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `ProductPriceList/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductPriceListCreate = createAsyncThunk(
  "ProductPriceList/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "ProductPriceList",
        data
      );

      dispatch(getProductPriceList({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductPriceListUpdate = createAsyncThunk(
  "ProductPriceList/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "ProductPriceList",
        data
      );

      dispatch(getProductPriceList({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const ProductPriceListDelete = createAsyncThunk(
  "ProductPriceList/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `ProductPriceList/${data.id}`
      );

      dispatch(getProductPriceList({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

//   "taxconfiguration/taxTypeLookup",
//   async (data: any, {dispatch}: Redux) => {
//     try {
//       // const response = await axios.post(ROOT_BASE_API + "lookupvalues/search", data);
//       const response = await axios.get(ROOT_BASE_API + "lookupvalues?lookupTypesCode=TAX_TYPES",);

//       // dispatch(taxConfigurationSearch({}))
//       return response.data;
//     } catch (e: any) {
//       console.log(e);
//     }
//   }
// );

export interface Stro {
  data: Array<{}>;
  error: any;
  message: any;
  isLoading: boolean;
}

export const ProductPriceList = createSlice({
  name: "ProductPriceList",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductPriceList.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(ProductPriceListCreate.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getProductPriceList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getProductPriceList.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });

    builder.addCase(ProductPriceListDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
      state.isLoading = false;
    });
  },
});

export default ProductPriceList.reducer;
