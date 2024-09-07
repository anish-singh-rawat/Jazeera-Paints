import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import AppStorage from "src/app/AppStorage";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";
// import i18n from "src/configs/i18n";
// import generateTranslations from "src/@core/utils/generateTranslations";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// For Populating the language over Local Storage (Future Use)
// const populateLanguage = (translations: any) => {
//   for (const language in translations) {
//     if (translations.hasOwnProperty(language)) {
//       i18n.addResourceBundle(
//         language,
//         "translation",
//         translations[language].translation
//       )
//     }
//   }
// };

export const translationsSearch = createAsyncThunk(
  "translationsList/fetchData",
  async (data: any, { dispatch }: Redux) => {
    const response = await axios.get(
      ROOT_BASE_API + "translations?appType=web"
    );
    await AppStorage.setData("trans-list", response?.data);
    await require("../../../configs/i18n");

    return response.data;
  }
);

export const translationsSearchMobile = createAsyncThunk(
  "translationsList/fetchDataMobile",
  async (data: any, { dispatch }: Redux) => {
    const response = await axios.get(
      ROOT_BASE_API + "translations?appType=mobile"
    );

    return response.data;
  }
);

export const translationCreate = createAsyncThunk(
  "translationsList/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "translations", data);
      dispatch(translationsSearch({}));
      dispatch(translationsSearchMobile({}));

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const translationGetById = createAsyncThunk(
  "translationsList/fetchItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `translations/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const translationDelete = createAsyncThunk(
  "translationsList/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `translations/${data.id}`
      );
      dispatch(translationsSearch({}));
      dispatch(translationsSearchMobile({}));

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const translationUpdate = createAsyncThunk(
  "translationsList/updateItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "translations", data);
      dispatch(translationsSearch({}));
      dispatch(translationsSearchMobile({}));

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Stro {
  data: Array<{}>;
  mobileData: Array<{}>;
  message: any;
  statusMessage: any;
  isLoading: any;
}

export const translationsList = createSlice({
  name: "translationsList",
  initialState: {
    data: [],
    mobileData: [],
    message: [],
    statusMessage: [],
    isLoading: [],
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(translationsSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(translationsSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(translationCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(translationsSearchMobile.fulfilled, (state, action) => {
      state.mobileData = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(translationsSearchMobile.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(translationDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
  },
});

export default translationsList.reducer;