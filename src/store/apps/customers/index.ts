// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ROOT_BASE_API } from "..";

// ** Axios Imports
import { axiosInstance as axios } from "src/configs/axios";

interface DataParams {
  q: string;
  dates?: Date[];
  status: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch Invoices
// export const fetchData2222 = createAsyncThunk('appCustomers/fetchData', async (params: DataParams) => {
//   const response = await axios.get('/apps/invoice/invoices', {
//     params
//   })

const debounce = (callback: Function, delay: number) => {
  let timer: any = null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};
const debounced = debounce(
  (dispatch: any, func: Function, arg: any) => dispatch(func(arg)),
  500
);
export const debouncedSearchData =
  (arg: any, func: Function) => (dispatch: any) =>
    debounced(dispatch, func, arg);

//Fetch Customer Data

interface IPaginate {
  skip?: number;
  limit?: number;
  value?: string;
}

export const fetchAnalyticsData = createAsyncThunk(
  "appCustomers/fetchTilesData",
  async () => {
    const response = await axios.get(
      'customer/tiles'
    );

    return response.data;
  }
);

export const fetchData = createAsyncThunk(
  "appCustomers/fetchData",
  async ({ skip = 0, limit = 10, value }: IPaginate, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(fetchAnalyticsData());
    const response = await axios.get(ROOT_BASE_API + "customer", {
      params: {
        skip,
        limit,
        ...(value && { searchItem: value })
      },
      signal: thunkAPI.signal
    });
    return response.data;
  }
);

// ** Add User
export const addUser = createAsyncThunk(
  "appCustomers/addUser",
  async (data: any, { getState, dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "customer", {
        ...data.data,
      });
      dispatch(fetchData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// ** Update User
export const updateUser = createAsyncThunk(
  "appCustomers/updateUser",
  async (data: any, { getState, dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "customer", {
        ...data.data,
      });
      dispatch(fetchData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// ** Delete User
export const deleteUser = createAsyncThunk(
  "appCustomers/deleteUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `customer/${data?.id}`
      );

      dispatch(fetchData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// ** Entity by ID

export const userGetById = createAsyncThunk(
  "appCustomers/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API +
          `customer/${data?.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// ** Fetch Search Customer
export const fetchSearchData = createAsyncThunk(
  "appCustomers/fetchSearchData",

  async (data: { [key: string]: number | string }) => {
    const response = await axios.get(
      ROOT_BASE_API +
        `customer?skip=${data.skip}&limit=${data.limit}&searchItem=${data.searchItem}`
    );

    return response.data;
  }
);

export const fetchCountry = createAsyncThunk(
  "appCustomers/fetchCountry",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "country");
    return response.data;
  }
);

// ** Fetch region
export const fetchRegion = createAsyncThunk(
  "appCustomers/fetchRegion",
  async (data: { [key: string]: number | string }) => {
    const response = await axios.get(
      ROOT_BASE_API +
        `region/fetchRegionsByCountry?countryId=${data?.countryId}`,
      data
    );
    return response.data;
  }
);

// ** Fetch city
export const fetchCity = createAsyncThunk(
  "appCustomers/fetchCity",
  async (data: { [key: string]: number | string }) => {
    const response = await axios.get(
      ROOT_BASE_API +
        `city/fetchCitiesByRegionAndCountry?regionId=${data?.regionId}&countryId=${data?.countryId}`,
      data
    );
    return response.data;
  }
);

// ** Fetch District
export const fetchDistrict = createAsyncThunk(
  "appCustomers/fetchDistrict",
  async (data: { [key: string]: number | string }) => {
    const response = await axios.get(
      ROOT_BASE_API +
        `district/fetchDistrictsByCityRegionAndCountry?cityId=${data?.cityId}&regionId=${data?.regionId}&countryId=${data?.countryId}`,
      data
    );

    return response.data;
  }
);

export const fetchCustomerGroup = createAsyncThunk(
  "appCustomers/fetchCustomerGroup",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "customergroup?active=true"
    );

    return response.data;
  }
);

export const fetchDistributionChannel = createAsyncThunk(
  "appCustomers/fetchDistributionChannel",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "distributionchannel?active=true"
    );

    return response.data;
  }
);

export const fetchCustomerDivision = createAsyncThunk(
  "appCustomers/fetchCustomerDivision",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "customerdivision?active=true"
    );

    return response.data;
  }
);

export const fetchParentCustomer = createAsyncThunk(
  "appCustomers/fetchParentCustomer",
  async (data: { [key: string]: number | string }) => {
    const response = await axios.get(
      ROOT_BASE_API + "customer/searchdropdown",
      data
    );
    return response.data;
  }
);

export const fetchSalesman = createAsyncThunk(
  "appCustomers/fetchSalesman",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "salesman");

    return response.data;
  }
);

// export const fetchCustomerType = createAsyncThunk(
//   "appCustomers/fetchCustomerType",
//   async () => {
//     const response = await axios.get(
//       ROOT_BASE_API + "customertype/search"
//     );

//     return response.data;
//   }
// );

export const fetchCustomerClass = createAsyncThunk(
  "appCustomers/fetchCustomerClass",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "customerclass?active=true"
    );

    return response.data;
  }
);

export const fetchPaymentTerms = createAsyncThunk(
  "appCustomers/fetchPaymentTerms",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "paymentterms");

    return response.data;
  }
);

export const fetchBasicTaxGroup = createAsyncThunk(
  "appCustomers/fetchBasicTaxGroup",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "BasicTax?active=true");

    return response.data;
  }
);

export const fetchPriceList = createAsyncThunk(
  "appCustomers/fetchPriceList",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "pricelist/dropdownpricelists");

    return response.data;
  }
);

export const fetchCurrency = createAsyncThunk(
  "appCustomers/fetchCurrency",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "currency");

    return response.data;
  }
);

export const fetchTax = createAsyncThunk("appCustomers/fetchTax", async () => {
  const response = await axios.get(
    ROOT_BASE_API + "lookupvalues?lookupTypesCode=CUSTOMER_TAX_GROUP_TYPES"
  );

  return response.data;
});



export const fetchCustomerStatus = createAsyncThunk(
  "appCustomers/fetchCustomerStatus",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=CUSTOMER_STATUS"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);


export const  fetchtaxGroupType = createAsyncThunk(
  "appCustomers/fetchtaxGroupType",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "taxgroups?active=true&taxGroupType=BASIC_TAX_GROUP"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchBasicTaxSearch = createAsyncThunk(
  "appCustomers/fetchBasicTax",
  async (data: { [key: string]: number | string | any }) => {
    const response = await axios.get(ROOT_BASE_API + "BasicTax");

    return response.data;
  }
);

export const fetchCustomerTypes = createAsyncThunk(
  "appCustomers/fetchCustomerTypes",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=CUSTOMER_TYPES"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const  fetchtaxAdvanceType = createAsyncThunk(
  "appCustomers/fetchtaxAdvanceType",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "taxgroups?active=true&taxGroupType=BUSINESS_TAX_GROUP"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchbasicTaxGroupIdTypes = createAsyncThunk(
  "appCustomers/fetchbasicTaxGroupIdTypes",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "taxconfigurations?basicTaxGroupId=173"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchCustomerGender = createAsyncThunk(
  "appCustomers/fetchCustomerGender",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=GENDER"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchAttribute1 = createAsyncThunk(
  "appCustomers/fetchAttribute1",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "CustomerAttribute01/dropdown"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchAttribute2 = createAsyncThunk(
  "appCustomers/fetchAttribute2",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "CustomerAttribute02/dropdown"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchAttribute3 = createAsyncThunk(
  "appCustomers/fetchAttribute3",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "CustomerAttribute03/dropdown"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchAttribute4 = createAsyncThunk(
  "appCustomers/fetchAttribute4",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "CustomerAttribute04/dropdown"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchAttribute5 = createAsyncThunk(
  "appCustomers/fetchAttribute5",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "CustomerAttribute05/dropdown"
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  districts: [];
  region: [];
  searchCustomers: Array<{}>;
  total: 1;
  params: {};
  allData: [];
  countries: [];
  cities: [];
  customerGroup: [];
  distributionChannel: [];
  customerDivision: [];
  salesman: [];
  customerType: [];
  customerClass: [];
  paymentTerms: [];
  basicTax:[],
  priceList: [];
  currency: [];
  tax: [];
  parentCustomer: [];
  customerStatus: [];
  bussinesstaxGroup : [];
  basicTaxGroup:[];
  advancetaxAdvance:[];
  customerGender: [];
  basicTaxSetupSearch: [];
  isLoading: any;
  tilesData: any;
  attribute1: [];
  attribute2: [];
  attribute3: [];
  attribute4: [];
  attribute5: [];

}
export const appCustomersSlice = createSlice({
  name: "appCustomers",
  initialState: {
    data: [],
    districts: [],
    region: [],
    searchCustomers: [],
    total: 1,
    params: {},
    allData: [],
    countries: [],
    cities: [],
    customerGroup: [],
    distributionChannel: [],
    customerDivision: [],
    salesman: [],
    customerType: [],
    customerClass: [],
    paymentTerms: [],
    basicTax:[],
    priceList: [],
    currency: [],
    tax: [],
    parentCustomer: [],
    customerStatus: [],
    bussinesstaxGroup : [],
    basicTaxGroup:[],
    advancetaxAdvance:[],
    customerGender: [],
    basicTaxSetupSearch: [],
    isLoading:[],
    tilesData: [],
    attribute1: [],
    attribute2: [],
    attribute3: [],
    attribute4: [],
    attribute5: [],

    
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAnalyticsData.fulfilled, (state, action) => {
      state.tilesData = action?.payload;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action?.payload?.data; //for pagination
      state.searchCustomers = [];
      state.isLoading = false;
    });
    builder.addCase(fetchData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchSearchData.fulfilled, (state, action) => {
      state.searchCustomers = action.payload.data || [];
      state.isLoading = false;
    });

    builder.addCase(fetchSearchData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      // state.data = [];
      state.searchCustomers = [];
      state.isLoading = true;
      if (action?.payload === undefined) {
        state.isLoading = false;
      }
    });
    builder.addCase(addUser.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addUser.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.pending, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(fetchDistrict.fulfilled, (state, action) => {
      state.districts = action.payload.data;
    });

    builder.addCase(fetchRegion.fulfilled, (state, action) => {
      state.region = action.payload.data;
    });

    builder.addCase(fetchCountry.fulfilled, (state, action) => {
      state.countries = action.payload.data;
    });

    builder.addCase(fetchCity.fulfilled, (state, action) => {
      state.cities = action.payload.data;
    });

    builder.addCase(fetchCustomerGroup.fulfilled, (state, action) => {
      state.customerGroup = action.payload.data;
    });

    builder.addCase(fetchDistributionChannel.fulfilled, (state, action) => {
      state.distributionChannel = action.payload.data;
    });

    builder.addCase(fetchCustomerDivision.fulfilled, (state, action) => {
      state.customerDivision = action.payload.data;
    });

    builder.addCase(fetchParentCustomer.fulfilled, (state, action) => {
      state.parentCustomer = action.payload.data;
    });

    builder.addCase(fetchSalesman.fulfilled, (state, action) => {
      state.salesman = action.payload.data;
    });

    builder.addCase(fetchCustomerTypes.fulfilled, (state, action) => {
      state.customerType = action.payload?.data;
    });

    builder.addCase(fetchCustomerClass.fulfilled, (state, action) => {
      state.customerClass = action.payload.data;
    });

    builder.addCase(fetchPaymentTerms.fulfilled, (state, action) => {
      state.paymentTerms = action.payload.data;
    });

    builder.addCase(fetchBasicTaxGroup.fulfilled, (state, action) => {
      state.basicTax = action.payload.data;
    });

    builder.addCase(fetchPriceList.fulfilled, (state, action) => {
      state.priceList = action.payload.data;
    });

    builder.addCase(fetchCurrency.fulfilled, (state, action) => {
      state.currency = action.payload.data;
    });

    builder.addCase(fetchTax.fulfilled, (state, action) => {
      state.tax = action?.payload?.data;
    });

    builder.addCase(fetchCustomerStatus.fulfilled, (state, action) => {
      state.customerStatus = action?.payload?.data;
    });

    builder.addCase(fetchtaxGroupType.fulfilled, (state, action) => {
      state.bussinesstaxGroup = action?.payload?.data;
    });

    builder.addCase(fetchBasicTaxSearch.fulfilled, (state, action) => {
      state.basicTaxSetupSearch = action?.payload?.data;
    });

    builder.addCase(fetchbasicTaxGroupIdTypes.fulfilled, (state, action) => {
      state.basicTaxGroup = action?.payload?.data;
    });

    builder.addCase(fetchtaxAdvanceType.fulfilled, (state, action) => {
      state.advancetaxAdvance = action?.payload?.data;
    });
    
    builder.addCase(fetchCustomerGender.fulfilled, (state, action) => {
      state.customerGender = action?.payload?.data;
    });

    builder.addCase(fetchAttribute1.fulfilled, (state, action) => {
      state.attribute1 = action?.payload?.data;
    });

    builder.addCase(fetchAttribute2.fulfilled, (state, action) => {
      state.attribute2 = action?.payload?.data;
    });

    builder.addCase(fetchAttribute3.fulfilled, (state, action) => {
      state.attribute3 = action?.payload?.data;
    });

    builder.addCase(fetchAttribute4.fulfilled, (state, action) => {
      state.attribute4 = action?.payload?.data;
    });

    builder.addCase(fetchAttribute5.fulfilled, (state, action) => {
      state.attribute5 = action?.payload?.data;
    });
  },
});

export default appCustomersSlice.reducer;
