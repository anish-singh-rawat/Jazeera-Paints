import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

// ** Axios Imports
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchDistributiondropdownchannel = createAsyncThunk(
  "customerdropdown/fetchDistributiondropdownchannel",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "distributionchannel/dropdown"
    );

    return response.data;
  }
);

export const fetchCustomergroupdropdownchannel = createAsyncThunk(
  "customerdropdown/fetchCustomergroupdropdownchannel",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "CustomerGroup/dropdown");

    return response.data;
  }
);

export const fetchCustomerclassdropdown = createAsyncThunk(
  "customerdropdown/fetchCustomerclassdropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "customerclass/dropdown");

    return response.data;
  }
);

export const fetchPaymentpatterndropdown = createAsyncThunk(
  "customerdropdown/fetchPaymentpatterndropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "paymentterms/dropdown");

    return response.data;
  }
);

export const fetchSalesmandropdown = createAsyncThunk(
  "customerdropdown/fetchSalesmandropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "salesman/dropdown");

    return response.data;
  }
);

export const fetchCustomerdivisiondropdownchannel = createAsyncThunk(
  "customerdropdown/fetchCustomerdivisiondropdownchannel",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "customerdivision/dropdown"
    );

    return response.data;
  }
);

export const fetchBasicTaxdropdownchannel = createAsyncThunk(
  "customerdropdown/fetchBasicTaxdropdownchannel",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "BasicTax/dropdown");

    return response.data;
  }
);

type store = {
  distributionchannel: [];
  CustomerGroup: [];
  customerclass: [];
  paymentterms: [];
  customerdivision: [];
  salesman: [];
  BasicTax: [];
};
const initialState: store = {
  distributionchannel: [],
  CustomerGroup: [],
  customerclass: [],
  paymentterms: [],
  customerdivision: [],
  salesman: [],
  BasicTax: [],
};

export const customerdropdown = createSlice({
  name: "customerdropdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchDistributiondropdownchannel.fulfilled,
      (state, action) => {
        state.distributionchannel = action.payload.data;
      }
    );
    builder.addCase(
      fetchCustomergroupdropdownchannel.fulfilled,
      (state, action) => {
        state.CustomerGroup = action.payload.data;
      }
    );
    builder.addCase(fetchCustomerclassdropdown.fulfilled, (state, action) => {
      state.customerclass = action.payload.data;
    });
    builder.addCase(fetchPaymentpatterndropdown.fulfilled, (state, action) => {
      state.paymentterms = action.payload.data;
    });
    builder.addCase(fetchSalesmandropdown.fulfilled, (state, action) => {
      state.salesman = action.payload.data;
    });
    builder.addCase(
      fetchCustomerdivisiondropdownchannel.fulfilled,
      (state, action) => {
        state.customerdivision = action.payload.data;
      }
    );
    builder.addCase(fetchBasicTaxdropdownchannel.fulfilled, (state, action) => {
      state.BasicTax = action.payload.data;
    });
  },
});
export default customerdropdown.reducer;
