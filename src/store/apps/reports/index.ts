import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { RootState } from "src/store";
import { ROOT_BASE_API } from "../";
import toast from "react-hot-toast";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface StockOnHandState {
  data: any;
  message: any;
  storeWise: any;
  shareStoreDetails: any;
  altUOM: object;
  error: any;
  isLoading: boolean;
  tilesData: {
    totalProduct: number;
    totalOnhandQuantity: number;
    totalTransitQuantity: number;
    totalSales: number;
    totalShipped: number;
  };
}

interface ISelectedCard {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
  isDeleted: boolean;
  address: string;
  mobileNumber: string;
  email: string;
}
interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
  classification?: string;
  byStore?: boolean;
  storeId?: number;
  storeArr?: Array<number>;
  productId?: number;
  batchId?: number;
  byBatch?: boolean;
  byProduct?: boolean;
  phone?: string;
  selectedCard?: ISelectedCard;
}

interface Altuom {
  baseUomId?: number;
  onhandQuantity?: number;
  productId?: number;
}

export const getstockOnhand = createAsyncThunk<
  any, // Define the type of the returned data
  IPaginate, // Define the type of the payload creator arguments
  { dispatch: Dispatch; signal: AbortSignal; state: RootState } // Define the type of the extra argument
>(
  "stockOnhand/fetchData",
  async (
    {
      skip = 0,
      limit = 10,
      storeId,
      storeArr,
      classification,
      byStore,
      search,
    }: IPaginate,
    thunkAPI: any
  ) => {
    const { dispatch } = thunkAPI;
    const params = {
      skip,
      limit,
      storeId,
      // ...(classification && { productClassification: classification }),
      ...(classification === "byBatch"
        ? { byBatch: true }
        : classification === "byProduct"
        ? { byProduct: true }
        : ""),
      ...(byStore && { byStore: true }),
      ...(storeId && { storeId: storeId }),
      ...(storeArr &&
        storeArr.length > 0 && { storeIdArr: storeArr.join(",") }),

      ...(search && { searchItem: search }),
    };

    const response = await axios.get(ROOT_BASE_API + "stockOnhand", {
      params: params, // This should just be your parameters object
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);
//   Can be Used for future
//   const response = await axios.get(url);
//     //   return response.data;
//     }
//   );

export const stockOnhandTiles = createAsyncThunk(
  "stockOnhand/fetchDataTiles",
  async () => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get("stockOnhand/tiles");

    return response.data;
  }
);

export const stockOnhandAltUOM = createAsyncThunk<
any, // Define the type of the returned data
Altuom, // Define the type of the payload creator arguments
{ dispatch: Dispatch; signal: AbortSignal; state: RootState } // Define the type of the extra argument
>(
  "stockOnhand/fetchDataAltUOM",
  async ({ baseUomId, onhandQuantity, productId }: Altuom, thunkAPI) => {
    console.log(baseUomId, onhandQuantity, productId, "baseUomId, onhandQuantity, productId");
    
    const response = await axios.get("StockOnhand/altuom", {
      params: { 
        baseUOMId: baseUomId,
        onhandQuantity: onhandQuantity,
        productId: productId,
      }, // Corrected to pass the params object properly
    });

    return response.data;
  }
);

export const stockOnhandStoreWise = createAsyncThunk<
  any, // Define the type of the returned data
  IPaginate, // Define the type of the payload creator arguments
  { dispatch: Dispatch; signal: AbortSignal; state: RootState } // Define the type of the extra argument
>(
  "stockOnhand/fetchDataStoreWise",
  async ({ productId, batchId, byBatch, byProduct }: IPaginate, thunkAPI) => {

    let params = {};

    if (byBatch === true) {
      params = { byBatch: true, batchId: batchId };
    } else if (byProduct === true) {
      params = { byProduct: true, productId: productId };
    }

    // Assuming 'thunkAPI.signal' is available in this context.
    const response = await axios.get(ROOT_BASE_API + "StockOnhand/storeWise", {
      params: params,
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

export const stockOnhandShareStoreDetails = createAsyncThunk(
  "stockOnhand/fetchDataShareStoreDetails",
  async ({ phone, selectedCard }: IPaginate, thunkAPI) => {
    try {
      if (!selectedCard) {
        throw new Error("selectedCard is undefined");
      }
      const {
        code,
        name,
        altName,
        active,
        isDeleted,
        address,
        mobileNumber,
        email,
      } = selectedCard;

      const selectedCardArray = [
        code,
        name,
        altName,
        active,
        isDeleted,
        address,
        mobileNumber,
        email,
      ];

      const response = await axios.post("StockOnhand/ShareStoreDetails", {
        storeDetails: selectedCardArray,
        mobileNumber: phone,
      });
      // Handle response status or data here if needed
      return response.data;
    } catch (error) {
      // Handle errors
      throw error; // Rethrow the error to be caught by the action dispatcher
    }
  }
);

export const stockOnhandSlice = createSlice({
  name: "stockOnhand",
  initialState: {
    data: [],
    isLoading: false,
    tilesData: {
      totalProduct: NaN,
      totalOnhandQuantity: NaN,
      totalTransitQuantity: NaN,
      totalSales: NaN,
      totalShipped: NaN,
    },
    error: [],
    message: [],
    altUOM: [],
    storeWise: [],
    shareStoreDetails: [],
  } as StockOnHandState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getstockOnhand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getstockOnhand.fulfilled, (state, action) => {
        state.data = action.payload; // Assuming the API directly returns the array of stock data
        state.isLoading = false;
      })
      .addCase(getstockOnhand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandTiles.fulfilled, (state, action) => {
        state.tilesData = action.payload;
      })
      .addCase(stockOnhandAltUOM.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(stockOnhandAltUOM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandAltUOM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandStoreWise.pending, (state) => {
        state.isLoading = true; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandStoreWise.fulfilled, (state, action) => {
        state.storeWise = action.payload.data; // Assuming the API directly returns the array of stock data
        state.isLoading = false;
      })
      .addCase(stockOnhandStoreWise.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandShareStoreDetails.pending, (state) => {
        state.isLoading = true; // Capture and store any error if the action fails
      })
      .addCase(stockOnhandShareStoreDetails.fulfilled, (state, action) => {
        state.shareStoreDetails = action.payload.data; // Assuming the API directly returns the array of stock data
        state.isLoading = false;
      })
      .addCase(stockOnhandShareStoreDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error; // Capture and store any error if the action fails
      });
  },
});

export default stockOnhandSlice.reducer;
