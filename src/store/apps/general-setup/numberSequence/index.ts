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
  //   Company: [];
  //   country: [];
  //   pricelist: [];
  //   currency: [];
  //   BasicTax: [];
  //   EntityTypes: [];
     singleNumberSequence: {};
  //   CoastingMethod: [];
}

export const getSequenceSetup = createAsyncThunk(
  "sequenceSetup/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "productdivision/fetch", data);
    const response = await axios.get(ROOT_BASE_API + "SequenceSetup");
    // console.log(
    //   response.data.data,
    //   "sssssssssssssssssssssssssssssssssssssssss"
    // );

    return response.data;
  }
);

export const sequenceSetupCreate = createAsyncThunk(
  "sequenceSetup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productdivisions/save", data);
      const response = await axios.post(ROOT_BASE_API + "SequenceSetup", data);

      // console.log(response, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      dispatch(getSequenceSetup({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const numberSequenceUpdate = createAsyncThunk(
  "SequenceSetup/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/update", data);
      const response = await axios.patch(ROOT_BASE_API + "SequenceSetup", data);

      dispatch(getSequenceSetup({}));
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

export const numberSequenceDelete = createAsyncThunk(
  "SequenceSetup/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `SequenceSetup/${data.id}`
      );

      dispatch(getSequenceSetup({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// export const fetchlegalentitiescompanydropdown = createAsyncThunk(
//   "legalEntities/fetchCompaniesdropdown",
//   async () => {
//     const response = await axios.get(ROOT_BASE_API + "Companies/dropdown");

//     return response.data;
//   }
// );

// export const fetchEntityTypes = createAsyncThunk(
//   "legalEntity/fetchEntityTypes",
//   async () => {
//     const response = await axios.get(
//       "lookupvalues?lookupTypesCode=ENTITY_TYPE"
//     );

//     return response.data;
//   }
// );

// export const fetchCoastingMethod = createAsyncThunk(
//   "legalEntity/fetchCoastingMethod",
//   async () => {
//     const response = await axios.get(
//       "lookupvalues?lookupTypesCode=COASTING_METHODS"
//     );

//     return response.data;
//   }
// );

// export const fetchBasicTaxdropdownchannel = createAsyncThunk(
//   "legalEntities/fetchBasicTaxdropdownchannel",
//   async () => {
//     const response = await axios.get(ROOT_BASE_API + "BasicTax/dropdown");
//     //console.log(response.data, "ccccccccccccccccccccccccccccccccccccccccc");

//     return response.data;
//   }
// );

// export const fetchlegalentitiescountrydropdown = createAsyncThunk(
//   "legalEntities/fetchcountry",
//   async () => {
//     const response = await axios.get(ROOT_BASE_API + `country`);

//     return response.data;
//   }
// );

// export const fetchlegalentitiescurrencydropdown = createAsyncThunk(
//   "legalEntities/fetchcurrency",
//   async () => {
//     const response = await axios.get(ROOT_BASE_API + `currency`);

//     return response.data;
//   }
// );

// export const fetchlegalentitiespricelistdropdown = createAsyncThunk(
//   "legalEntities/fetchpricelistdropdownpricelists",
//   async () => {
//     const response = await axios.get(
//       ROOT_BASE_API + "pricelist/dropdownpricelists"
//     );

//     return response.data;
//   }
// );

export const numberSequenceetById = createAsyncThunk(
  "SequenceSetup/id",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "productsDivision/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `SequenceSetup/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const numberSequence = createSlice({
  name: "legalEntities",

  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    // Company: [],
    // country: [],
    // pricelist: [],
    // currency: [],
    // BasicTax: [],
    // EntityTypes: [],
     singleNumberSequence:[],
    // CoastingMethod: []
  } as Stro,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSequenceSetup.fulfilled, (state, action) => {
      state.data = action?.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(getSequenceSetup.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getSequenceSetup.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(numberSequenceetById.fulfilled, (state, action) => {
      state.singleNumberSequence = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(numberSequenceUpdate.fulfilled, (state, action) => {
      state.singleNumberSequence = action?.payload;
      state.isLoading = false;
    });
    builder.addCase(sequenceSetupCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(sequenceSetupCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    // builder.addCase(productDivisionToggle.fulfilled, (state, action) => {
    //   state.toggleMessage = action?.payload;
    // });
    builder.addCase(numberSequenceDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    // builder.addCase(
    //   fetchlegalentitiescompanydropdown.fulfilled,
    //   (state, action) => {
    //     state.Company = sortItemsByName(action.payload?.data);
    //   }
    // );
    // builder.addCase(
    //   fetchlegalentitiescountrydropdown.fulfilled,
    //   (state, action) => {
    //     state.country = sortItemsByName(action.payload?.data);
    //   }
    // );

    // builder.addCase(fetchBasicTaxdropdownchannel.fulfilled, (state, action) => {
    //   state.BasicTax = sortItemsByName(action.payload?.data);
    // });

    // builder.addCase(fetchEntityTypes.fulfilled, (state, action) => {
    //   state.EntityTypes = sortItemsByName(action.payload?.data);
    // });

    // builder.addCase(fetchCoastingMethod.fulfilled, (state, action) => {
    //   state.CoastingMethod = sortItemsByName(action.payload?.data);
    // });

    // builder.addCase(
    //   fetchlegalentitiescurrencydropdown.fulfilled,
    //   (state, action) => {
    //     state.currency = sortItemsByName(action.payload?.data);
    //   }
    // );
    // builder.addCase(
    //   fetchlegalentitiespricelistdropdown.fulfilled,
    //   (state, action) => {
    //     state.pricelist = sortItemsByName(action.payload?.data);
    //   }
    // );
  },
});

export default numberSequence.reducer;
