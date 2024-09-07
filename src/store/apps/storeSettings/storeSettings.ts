import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
}

export interface Store {
  data: Array<{}>;
  storeTilesData: Array<{}>;
  res: Array<{}>;
  paymentData: Array<{}>;
  dataById: Array<{}>;
  posTerminlasDataById: Array<{}>;
  offlinePOS: Array<{}>;
  storesTypes: Array<{}>;
  legalEntity: Array<{}>;
  businessUnit: Array<{}>;
  customerData: Array<{}>;
  priceList: Array<{}>;
  posTerminalData: Array<{}>;
  company: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
  activeStoreInfo: any;
  searchData: Array<{}>;
  totalCount: Array<{}>;
}

export const fetchAllStoresList = createAsyncThunk(
  "storeSettings/fetchAllData",
  async () => {
    // const response = await axios.post(ROOT_BASE_API + "Productgroups/search", data);
    const response = await axios.get("stores");

    return response.data;
  }
);

export const storesListGet = createAsyncThunk(
  "storeSettings/fetchData",
  async ({ skip = 0, limit = 10, search }: IPaginate, thunkAPI) => {
    const params: any = {
      skip,
      limit,
      ...(search && { searchItem: search }),
    };

    const response = await axios.get(ROOT_BASE_API + "stores", {
      params,
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

export const storesGetById = createAsyncThunk(
  "storeSettings/GetById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`stores/${data.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const storesDelete = createAsyncThunk(
  "storeSettings/delete",
  async (id: number | string | any, { dispatch }: Redux) => {
    const response = await axios.delete(`stores/${id?.id}`);
    dispatch(storesListGet({}));
    return response.data;
  }
);

export const storesCreate = createAsyncThunk(
  "storeSettings/create",
  async (data: any, { dispatch }: Redux) => {
    const res = await axios.post("stores", data);
    return res.data;
  }
);

export const storesUpdate = createAsyncThunk(
  "storeSettings/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("stores", data);

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const storesTypes = createAsyncThunk(
  "storeSettings/storesTypes",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get("storetypes");

      // dispatch(storesListGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const offlinePOS = createAsyncThunk(
  "storeSettings/offlinePOS",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get("posterminals/dropdown");

      // dispatch(storesListGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const businessUnit = createAsyncThunk(
  "storeSettings/businessUnit",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get("BusinessUnits");

      // dispatch(storesListGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const customerData = createAsyncThunk(
  "storeSettings/customerData",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get("customer");

      // dispatch(storesListGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const priceList = createAsyncThunk(
  "storeSettings/priceList",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get("pricelist/dropdownpricelists");

      // dispatch(storesListGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const legalEntity = createAsyncThunk(
  "storeSettings/legalEntity",
  async (active: boolean, { dispatch }: { dispatch: Dispatch }) => {
    try {
      const response = await axios.get("Legalentities", {
        params: {
          ...(active && { active }), // Conditionally include active parameter
        },
      });

      // Dispatch any other actions if needed
      // dispatch(storesListGet());

      return response.data;
    } catch (error) {
      console.error("Error fetching legal entities:", error);
      throw error; // Rethrow the error to let the caller handle it
    }
  }
);


export const companyByLegalEntityId = createAsyncThunk(
  "storeSettings/companyByLegalEntityId",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`Legalentities/${data?.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const storeTiles = createAsyncThunk(
  "storeSettings/fetchTilesData",
  async () => {
    const response = await axios.get("stores/tiles");

    return response.data;
  }
);

export const fetchStoresBySearchData = createAsyncThunk(
  "storeSettings/fetchStoresBySearchData",
  async (data: { [key: string]: number | string }) => {
    let URL = `stores?skip=${data.skip}&limit=${data.limit}&searchItem=${data.searchItem}`;
    try {
      const response = await axios.get(URL);

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// ** paymentMethod

export const paymentMethodsList = createAsyncThunk(
  "paymentMethod/fetchData",
  async () => {
    const response = await axios.get("paymentMethods");

    return response.data;
  }
);

export const paymentMethodsCreate = createAsyncThunk(
  "paymentMethod/create",
  async (data: any, { dispatch }: Redux) => {
    const res = await axios.post("paymentMethods", data);
    //dispatch(paymentMethodsList());
    return res.data;
  }
);

export const paymentMethodsUpdate = createAsyncThunk(
  "paymentMethod/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("paymentMethods", data);

      dispatch(paymentMethodsList());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

//**posSetup */

export const posTerminalsList = createAsyncThunk(
  "posTerminals/fetchData",
  async () => {
    const response = await axios.get("posterminals");

    console.log(response.data);

    return response.data;
  }
);

export const posTerminalsCreate = createAsyncThunk(
  "posTerminals/create",
  async (data: any, { dispatch }: Redux) => {
    const res = await axios.post("posterminals", data);
    return res.data;
  }
);

export const posTerminalsUpdate = createAsyncThunk(
  "posTerminals/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("posterminals", data);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const posTerminalsDelete = createAsyncThunk(
  "posTerminals/delete",
  async ({ id, storeId }: any, { dispatch }: Redux) => {
    const response = await axios.delete(`posterminals/${id?.id}`);
    dispatch(storesGetById({ id: storeId }));

    return response.data;
  }
);

export const posterminalsGetById = createAsyncThunk(
  "posTerminals/GetById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`posterminals/${data.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const storeSettingsStore = createSlice({
  name: "storeSettings",
  initialState: {
    data: [],
    storeTilesData: [],
    paymentData: [],
    dataById: [],
    activeStoreInfo: {},
    posTerminlasDataById: [],
    offlinePOS: [],
    storesTypes: [],
    businessUnit: [],
    customerData: [],
    priceList: [],
    posTerminalData: [],
    legalEntity: [],
    company: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    res: [],
    searchData: [],
    totalCount: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storesListGet.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.totalCount = action.payload?.totalCount;
      state.isLoading = false;
      state.dataById = [];
    });
    builder.addCase(storesListGet.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllStoresList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(storesCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllStoresList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllStoresList.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(storesCreate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeStoreInfo = action.payload;
      state.dataById = action.payload;
      state.res = action.payload;
    });
    builder.addCase(storesListGet.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(storesTypes.fulfilled, (state, action) => {
      state.storesTypes = action.payload.data;
    });
    builder.addCase(offlinePOS.fulfilled, (state, action) => {
      state.offlinePOS = action.payload.data;
    });
    builder.addCase(businessUnit.fulfilled, (state, action) => {
      state.businessUnit = action.payload.data;
    });
    builder.addCase(customerData.fulfilled, (state, action) => {
      state.customerData = action.payload.data;
    });
    builder.addCase(priceList.fulfilled, (state, action) => {
      state.priceList = action.payload.data;
    });
    builder.addCase(legalEntity.fulfilled, (state, action) => {
      state.legalEntity = action.payload.data;
    });
    builder.addCase(storeTiles.fulfilled, (state, action) => {
      state.storeTilesData = action.payload;
    });
    builder.addCase(companyByLegalEntityId.fulfilled, (state, action) => {
      //state.company = action.payload?.company;
      state.company = action.payload;
    });
    builder.addCase(posTerminalsList.fulfilled, (state, action) => {
      state.posTerminalData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(posTerminalsList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(posTerminalsList.rejected, (state, action) => {
      state.isLoading = false;
      state.posTerminalData = [];
    });
    builder.addCase(paymentMethodsCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(paymentMethodsCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(storesGetById.fulfilled, (state, action) => {
      state.dataById = action.payload;
      state.activeStoreInfo = action.payload;
    });
    builder.addCase(paymentMethodsList.fulfilled, (state, action) => {
      state.paymentData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(paymentMethodsList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(paymentMethodsList.rejected, (state, action) => {
      state.isLoading = false;
      state.paymentData = [];
    });
    builder.addCase(posTerminalsCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(posTerminalsCreate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.res = action.payload;
    });
    builder.addCase(posterminalsGetById.fulfilled, (state, action) => {
      //console.log('test_pos_edit',state.posTerminlasDataById)
      state.posTerminlasDataById = action.payload;
    });
    builder.addCase(fetchStoresBySearchData.fulfilled, (state, action) => {
      state.searchData = action.payload?.data || [];
      state.totalCount = action.payload?.totalCount || [];
    });
  },
});

export default storeSettingsStore.reducer;
