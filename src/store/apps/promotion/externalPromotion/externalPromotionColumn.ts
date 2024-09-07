import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const externalPromotionHeaderColumnList = createAsyncThunk(
  "externalPromotionColumn/fetchListData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl =
      data.data === "all"
        ? ROOT_BASE_API + "PromotionHeaderColumns"
        : ROOT_BASE_API + "PromotionHeaderColumns?active=true";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export const externalPromotionHeaderGetById = createAsyncThunk(
  "externalPromotionColumn/GetById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `PromotionHeader/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderCreate = createAsyncThunk(
  "externalPromotionColumn/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "PromotionHeader",
        data
      );

      dispatch(externalPromotionHeaderColumnList({ data: "all" }));
      //   dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderUpdate = createAsyncThunk(
  "externalPromotionColumn/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "PromotionHeader",
        data
      );

      dispatch(externalPromotionHeaderColumnList({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderDelete = createAsyncThunk(
  "externalPromotionColumn/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `PromotionHeader/${data.id}`
      );

      dispatch(externalPromotionHeaderColumnList({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderToggle = createAsyncThunk(
  "externalPromotionColumn/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "PromotionHeader/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const lookUpValue = createAsyncThunk(
  "externalPromotionColumn/conditionTypeList",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `lookupvalues?lookupTypesCode=${data?.lookupTypesCode}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const instantDiscount = createAsyncThunk(
  "externalPromotionColumn/instantDiscount",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `InstantDiscount?skip=0&limit=1000&externalPromotionHeader=${data.externalPromotionHeaderIds}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const lineDiscount = createAsyncThunk(
  "externalPromotionColumn/lineDiscount",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `LineDiscount?skip=0&limit=1000&externalPromotionHeader=${data.externalPromotionHeaderIds}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const pricingList = createAsyncThunk(
  "externalPromotionColumn/pricing",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `Pricing?skip=0&limit=1000&externalPromotionHeader=${data.externalPromotionHeaderIds}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const freeGoods = createAsyncThunk(
  "externalPromotionColumn/freeGoods",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `FreeGoods?skip=0&limit=1000&externalPromotionHeader=${data.externalPromotionHeaderIds}`
      );

      return response.data;
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
  lookUpData: any;
  instantDiscountData: any;
  pricingData: any;
  lineDiscountData: any;
  freeGoodsData: any;
}

export const externalPromotionColumn = createSlice({
  name: "externalPromotionColumn",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    lookUpData: [],
    instantDiscountData: [],
    pricingData: [],
    lineDiscountData: [],
    freeGoodsData: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      externalPromotionHeaderColumnList.fulfilled,
      (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
      }
    );
    builder.addCase(
      externalPromotionHeaderColumnList.pending,
      (state, action) => {
        state.isLoading = true;
      }
    );
    builder.addCase(externalPromotionHeaderCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(
      externalPromotionHeaderCreate.fulfilled,
      (state, action) => {
        state.isLoading = false;
      }
    );
    builder.addCase(
      externalPromotionHeaderDelete.fulfilled,
      (state, action) => {
        state.message = action?.payload;
      }
    );
    builder.addCase(
      externalPromotionHeaderToggle.fulfilled,
      (state, action) => {
        state.toggleMessage = action?.payload;
      }
    );
    builder.addCase(lookUpValue.fulfilled, (state, action) => {
      state.lookUpData = action?.payload?.data;
    });
    builder.addCase(instantDiscount.fulfilled, (state, action) => {
      state.instantDiscountData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(pricingList.fulfilled, (state, action) => {
      state.pricingData = action.payload.data;
      console.log(state.pricingData,"storeData")
      state.isLoading = false;
    });
    builder.addCase(lineDiscount.fulfilled, (state, action) => {
      state.lineDiscountData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(freeGoods.fulfilled, (state, action) => {
      state.freeGoodsData = action.payload.data;
      state.isLoading = false;
    });
  },
});

export default externalPromotionColumn.reducer;
