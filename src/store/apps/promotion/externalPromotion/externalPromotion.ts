import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

interface PromotionHeaderParams {
  promotionType?: string;
  legalEntityId?: number | string;
  companyId?: number | string;
  data?: {};
}

// export const externalPromotionHeaderList = createAsyncThunk(
//   "externalPromotion/fetchListData",
//   async (data: { [key: string]: number | string | any }) => {
//     const apiUrl = data.data === "all" ? ROOT_BASE_API + "PromotionHeader" : data.type === "PRICING" || "INSTANT_DISCOUNT" || "LINE_DISCOUNT" || "FREE_GOODS" ? ROOT_BASE_API + `PromotionHeader?promotionType=${data.type}` : ROOT_BASE_API + "PromotionHeader?active=true";
//     const response = await axios.get(apiUrl);

//     return response.data;
//   }
// );

export const externalPromotionHeaderList = createAsyncThunk(
  "externalPromotion/fetchListData",
  async (params: PromotionHeaderParams) => {
    const { promotionType, legalEntityId, companyId } = params;
    const response = await axios.get("PromotionHeader", {
      params: {
        promotionType,
        legalEntityId,
        companyId,
      },
    });

    return response.data;
  }
);

export const externalPromotionHeaderGetById = createAsyncThunk(
  "externalPromotion/GetById",
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
  "externalPromotion/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "PromotionHeader", data);

      dispatch(externalPromotionHeaderList({data: "all"}));
    //   dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderUpdate = createAsyncThunk(
  "externalPromotion/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "PromotionHeader", data);

      dispatch(externalPromotionHeaderList({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderDelete = createAsyncThunk(
  "externalPromotion/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `PromotionHeader/${data.id}`
      );

      dispatch(externalPromotionHeaderList({data: "all"}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const externalPromotionHeaderToggle = createAsyncThunk(
  "externalPromotion/toggle",
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
  "externalPromotion/conditionTypeList",
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

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
  lookUpData: any;
  legalEntity: any;
}

export const externalPromotion = createSlice({
  name: "externalPromotion",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    lookUpData: [],
    legalEntity: []
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(externalPromotionHeaderList.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(externalPromotionHeaderList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(externalPromotionHeaderCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(externalPromotionHeaderCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(externalPromotionHeaderDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(externalPromotionHeaderToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
    builder.addCase(lookUpValue.fulfilled, (state, action) => {
      state.lookUpData = action?.payload?.data;
    });
    builder.addCase(legalEntity.fulfilled, (state, action) => {
      state.legalEntity = action.payload.data;
    });
  },
});

export default externalPromotion.reducer;
