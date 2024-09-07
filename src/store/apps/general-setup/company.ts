import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

// import { fetchCustomerGroup } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchCompany = createAsyncThunk(
  "company/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = ROOT_BASE_API + "Companies";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);
export const fetchCompanyType = createAsyncThunk(
  "company/fetchCompanyType",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl = ROOT_BASE_API + "lookupvalues?lookupTypesCode=COMPANY_TYPE";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);
export const createCompany = createAsyncThunk(
  "company/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "Companies", data);

      dispatch(fetchCompany({ data: "all" }));
      //   dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "Companies", data);

      dispatch(fetchCompany({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const companyGetById = createAsyncThunk(
  "company/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(ROOT_BASE_API + `Companies/${data.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const deleteSingleCompany = createAsyncThunk(
  "company/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `Companies/${data.id}`
      );

      dispatch(fetchCompany({ data: "all" }));
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
  companyTypes: Array<{}>;
}

export const company = createSlice({
  name: "company",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    companyTypes:[],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCompany.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(fetchCompany.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCompanyType.fulfilled, (state, action) => {
      state.companyTypes = action.payload.data;
      // state.isLoading = false;
    });
    builder.addCase(createCompany.fulfilled, (state, action) => {
      state.companyTypes = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(createCompany.pending, (state, action) => {
      state.isLoading = true;
    });
  },
});

export default company.reducer;
