import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { sortItemsByName } from "src/utils/utils";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Stro {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
  Company: [];
  country: [];
  priceList: [];
  currency: [];
  BasicTax: [];
  EntityTypes: [];
  singleLegalEntity: {};
  coastingMethod: [];
}

export const getLegalEntities = createAsyncThunk(
  "legalEntities/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "productdivision/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "Legalentities");
    // console.log(
    //   response.data.data,
    //   "sssssssssssssssssssssssssssssssssssssssss"
    // );

    return response.data;
  }
);

export const legalEntitiesCreate = createAsyncThunk(
  "legalEntities/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productdivisions/save", data);
      const response = await axios.post(ROOT_BASE_API + "Legalentities", data);

      // console.log(response, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      dispatch(getLegalEntities({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const legalEntitiesUpdate = createAsyncThunk(
  "legalEntities/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/update", data);
      const response = await axios.patch(ROOT_BASE_API + "Legalentities", data);

      dispatch(getLegalEntities({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// export const productDivisionToggle = createAsyncThunk(
//   "productsDivision/toggle",
//   async (data: any, { dispatch }: Redux) => {
//     try {
//       // const response = await axios.post(ROOT_BASE_API + "productsDivision/toggle", data);
//       const response = await axios.patch(
//         ROOT_BASE_API + "productdivisions/toggle",
//         data
//       );

//       return response.data;
//     } catch (e: any) {
//       console.log(e);
//     }
//   }
// );

export const legalEntitiesDelete = createAsyncThunk(
  "legalEntities/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `Legalentities/${data.id}`
      );

      dispatch(getLegalEntities({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchlegalentitiescompanydropdown = createAsyncThunk(
  "legalEntities/fetchCompaniesdropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "Companies/dropdown");

    return response.data;
  }
);

export const fetchEntityTypes = createAsyncThunk(
  "legalEntity/fetchEntityTypes",
  async () => {
    const response = await axios.get(
      "lookupvalues?lookupTypesCode=ENTITY_TYPE"
    );


    return response.data;
  }
);

export const fetchCoastingMethod = createAsyncThunk(
  "legalEntity/fetchCoastingMethod",
  async () => {
    const response = await axios.get(
      "lookupvalues?lookupTypesCode=COASTING_METHODS"
    );


    return response.data;
  }
);

export const fetchBasicTaxdropdownchannel = createAsyncThunk(
  "legalEntities/fetchBasicTaxdropdownchannel",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "BasicTax/dropdown");
    //console.log(response.data, "ccccccccccccccccccccccccccccccccccccccccc");

    return response.data;
  }
);

export const fetchlegalentitiescountrydropdown = createAsyncThunk(
  "legalEntities/fetchcountry",
  async () => {
    const response = await axios.get(ROOT_BASE_API + `country`);

    return response.data;
  }
);

export const fetchlegalentitiescurrencydropdown = createAsyncThunk(
  "legalEntities/fetchcurrency",
  async () => {
    const response = await axios.get(ROOT_BASE_API + `currency`);

    return response.data;
  }
);

export const fetchlegalentitiespricelistdropdown = createAsyncThunk(
  "legalEntities/fetchpricelistdropdownpricelists",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "pricelist/dropdownpricelists"
    );

    return response.data;
  }
);

export const legalEntitiesGetById = createAsyncThunk(
  "legalEntities/id",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `Legalentities/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const legalEntity = createSlice({
  name: "legalEntities",

  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    Company: [],
    country: [],
    priceList: [],
    currency: [],
    BasicTax: [],
    EntityTypes: [],
    singleLegalEntity:[],
    coastingMethod: []
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLegalEntities.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(legalEntitiesGetById.fulfilled, (state, action) => {
      state.singleLegalEntity = action?.payload;
      state.isLoading = false;
    });
    // builder.addCase(legalEntitiesUpdate.fulfilled, (state, action) => {
    //   state.singleLegalEntity = action?.payload;
    //   state.isLoading = false;
    // });
    builder.addCase(getLegalEntities.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(legalEntitiesCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(legalEntitiesCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getLegalEntities.rejected, (state, action) => {
      state.isLoading = false;
    });
    // builder.addCase(productDivisionToggle.fulfilled, (state, action) => {
    //   state.toggleMessage = action?.payload;
    // });
    builder.addCase(legalEntitiesDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(
      fetchlegalentitiescompanydropdown.fulfilled,
      (state, action) => {
        state.Company = sortItemsByName(action.payload?.data);
      }
    );
    builder.addCase(
      fetchlegalentitiescountrydropdown.fulfilled,
      (state, action) => {
        state.country = sortItemsByName(action.payload?.data);
      }
    );

    builder.addCase(fetchBasicTaxdropdownchannel.fulfilled, (state, action) => {
      state.BasicTax = sortItemsByName(action.payload?.data);
    });

    builder.addCase(fetchEntityTypes.fulfilled, (state, action) => {
      state.EntityTypes = sortItemsByName(action.payload?.data);
    });

    builder.addCase(fetchCoastingMethod.fulfilled, (state, action) => {
      state.coastingMethod = sortItemsByName(action.payload?.data);
    });

    builder.addCase(
      fetchlegalentitiescurrencydropdown.fulfilled,
      (state, action) => {
        state.currency = sortItemsByName(action.payload?.data);
      }
    );
    builder.addCase(
      fetchlegalentitiespricelistdropdown.fulfilled,
      (state, action) => {
        state.priceList = sortItemsByName(action.payload?.data);
      }
    );
  },
});

export default legalEntity.reducer;
