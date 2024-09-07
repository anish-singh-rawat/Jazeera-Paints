import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { axiosInstance as axios } from "src/configs/axios";
import { RootState } from "src/store";
import { ROOT_BASE_API } from "../..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

interface ProductsAddDataTypes {
  productSource: Array<{}>;
  unitOfMeasures: Array<{}>;
  addedProducts: any[];
  skuCodes: Array<{}>;
  associateServiceProducts: Array<{}>;
  associateServiceSearchedProducts: Array<{}>;
  assignedAssociateServiceProducts: Array<{}>;
  assignedAssociateServiceSearchedProducts: Array<{}>;
  independentServiceProducts: Array<{}>;
  independentServiceSearchedProducts: Array<{}>;
  assignedIndependentServiceProducts: Array<{}>;
  assignedIndependentServiceSearchedProducts: Array<{}>;
  tilesData: {
    totalCount: number;
    totalInactive: number;
    totalSellOnOnline: number;
    totalSellOnPos: number;
  };
  listData: Array<{}>;
  searchData: Array<{}>;
  totalCount: Array<{}>;
  associateServiceProductsTotalCount: Number;
  associateServiceSearchedProductsTotalCount: Number;
  assignedAssociateServiceProductsTotalCount: Number;
  assignedAssociateServiceSearchedProductsTotalCount: Number;
  independentServiceProductsTotalCount: Number;
  independentServiceSearchedProductsTotalCount: Number;
  assignedIndependentServiceProductsTotalCount: Number;
  assignedIndependentServiceSearchedProductsTotalCount: Number;
}

export interface Store {
  data: ProductsAddDataTypes;
  message: any;
  toggleMessage: any;
  isLoading: any;
  isAssociateServicesLoading: boolean;
  isAssociateServicesSearchLoading: boolean;
  isAssignedAssociateServicesLoading: boolean;
  isAssignedAssociateServicesSearchLoading: boolean;
  isIndependentServicesLoading: boolean;
  isIndependentServicesSearchLoading: boolean;
  isAssignedIndependentServicesLoading: boolean;
  isAssignedIndependentServicesSearchLoading: boolean;
  singleProduct: any;
  UOMlookups: any;
  productListData: [];
  error: [] | string;
}

interface IPaginate {
  skip?: number;
  limit?: number;
  search?: string;
  classification?: string;
  appType?: string;
}

export const fetchProductsListData = createAsyncThunk<
  any, // Define the type of the returned data
  IPaginate, // Define the type of the payload creator arguments
  { dispatch: Dispatch; signal: AbortSignal; state: RootState } // Define the type of the extra argument
>(
  "productsAdd/fetchListData",
  async (
    {
      skip = 0,
      limit = 10,
      appType = "admin",
      classification,
      search,
    }: IPaginate,
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI;
    const response = await axios.get(ROOT_BASE_API + "Products", {
      params: {
        skip,
        limit,
        appType,
        ...(classification && { productClassification: classification }),
        ...(search && { searchItem: search }),
      },
      signal: thunkAPI.signal,
    });

    return response.data;
  }
);

// export const fetchProductsListData: AsyncThunk<any, IPaginate, { dispatch: Dispatch; signal: AbortSignal; state: RootState }> = createAsyncThunk(
//   "productsAdd/fetchListData",
//   async ({ skip = 0, limit = 10, appType = "admin", classification, search }: IPaginate, thunkAPI) => {
//     const { dispatch } = thunkAPI;
//     const response = await axios.get(ROOT_BASE_API + "Products", {
//       params: {
//         skip,
//         limit,
//         appType,
//         ...(classification && { productClassification: classification }),
//         ...(search && { searchItem: search })
//       },
//       signal: thunkAPI.signal
//     });
//     dispatch(productsGet());

//     return response.data;
//   }
// );

export const productSources = createAsyncThunk(
  "productSources/fetchData",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "lookupvalues?lookupTypesCode=PRODUCT_SOURCES"
    );
    return response.data;
  }
);

export const productsGetById = createAsyncThunk(
  "productsGet/fetchById",
  async (id: number | string) => {
    try {
      const response = await axios.get(ROOT_BASE_API + `Products/${id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

// unit of measure
export const getUnitOfMeasure = createAsyncThunk(
  "getUOM/fetchUOM",
  async () => {
    try {
      const response = await axios.get(ROOT_BASE_API + "UnitOfMeasures");
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const createUnitOfMeasure = createAsyncThunk(
  "getUOM/addUOM",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "UnitOfMeasures", data);
      dispatch(getUnitOfMeasure());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getUnitOfMeasureById = createAsyncThunk(
  "unitOfMeasure/fetchById",
  async (id: string) => {
    try {
      const response = await axios.get(ROOT_BASE_API + `UnitOfMeasures/${id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const deleteUnitOfMeasure = createAsyncThunk(
  "unitOfMeasure/delete",
  async ({ id }: { id: string }, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(
        ROOT_BASE_API + `UnitOfMeasures/${id}`
      );
      dispatch(getUnitOfMeasure());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const updateUnitOfMeasure = createAsyncThunk(
  "unitOfMeasure/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + `UnitOfMeasures`,
        data
      );
      dispatch(getUnitOfMeasure());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getUOMLookups = createAsyncThunk(
  "getUOM/fetchLookUps",
  async () => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "lookupvalues?lookupTypesCode=UNIT_CLASS"
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productDelete = createAsyncThunk(
  "productsAdd/delete",
  async ({ id }: { id: string }, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(ROOT_BASE_API + `Products/${id}`);
      dispatch(fetchProductsListData({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsGet = createAsyncThunk("productsAdd/fetch", async () => {
  try {
    const response = await axios.get(
      ROOT_BASE_API + "Products?active=true&skip=0&limit=50&appType=admin"
    );
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
});

export const productsCreate = createAsyncThunk(
  "productsAdd/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "Products", data);
      dispatch(productsGet());
      dispatch(clearProductInformation());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsUpdate = createAsyncThunk(
  "productsAdd/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "Products", data);
      dispatch(productsGet());
      dispatch(clearProductInformation());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getSKUcodes = createAsyncThunk("SKUcodes/fetch", async () => {
  try {
    const response = await axios.get(ROOT_BASE_API + "skucodetypes");
    return response.data;
  } catch (e: any) {
    console.log(e);
  }
});

export const getProductsByServiceType = createAsyncThunk(
  "getServiceProducts/fetch",
  async (queryParams: any) => {
    try {
      const { isAssociate, limit, skip, id } = queryParams;
      let queryString = "";
      if (id) {
        queryString = `/serviceProducts?skip=${skip}&limit=${limit}&productClassification=SERVICE_PRODUCT&serviceType=${
          isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
        }&productId=${id}`;
      } else {
        queryString = `?skip=${skip}&limit=${limit}&appType=admin&productClassification=SERVICE_PRODUCT&serviceType=${
          isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
        }`;
      }
      const response = await axios.get(
        ROOT_BASE_API + "Products" + queryString
      );
      return {
        isAssociate: queryParams?.isAssociate,
        products: response?.data,
      };
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getSearchProductsByServiceType = createAsyncThunk(
  "getSearchProductsByServiceType/fetch",
  async (queryParams: any) => {
    try {
      const { isAssociate, limit, skip, searchItem, id } = queryParams;

      let queryString = "";
      if (id) {
        queryString = `/serviceProducts?skip=${skip}&limit=${limit}&productClassification=SERVICE_PRODUCT&serviceType=${
          isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
        }&productId=${id}&searchItem=${searchItem?.trim()}`;
      } else {
        queryString = `?skip=${skip}&limit=${limit}&appType=admin&productClassification=SERVICE_PRODUCT&serviceType=${
          isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
        }&searchItem=${searchItem?.trim()}`;
      }

      const response = await axios.get(
        ROOT_BASE_API + "Products" + queryString
      );
      return {
        isAssociate: queryParams?.isAssociate,
        products: response?.data,
      };
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getAssignedServicesOfProductsByServiceType = createAsyncThunk(
  "getAssignedServicesOfProductsByServiceType/fetch",
  async (queryParams: any) => {
    try {
      const { id, isAssociate, limit, skip } = queryParams;
      const queryString = `?skip=${skip}&limit=${limit}&productId=${id}&serviceType=${
        isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
      }`;
      const response = await axios.get(
        ROOT_BASE_API + "ProductServices" + queryString
      );
      return {
        isAssociate: queryParams?.isAssociate,
        products: response?.data,
      };
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const getSearchAssignedServicesOfProductsByServiceType =
  createAsyncThunk(
    "getSearchAssignedServicesOfProductsByServiceType/fetch",
    async (queryParams: any) => {
      try {
        const { id, isAssociate, limit, skip, searchItem } = queryParams;
        const queryString = `?skip=${skip}&limit=${limit}&productId=${id}&serviceType=${
          isAssociate ? "ASSOCIATE_SERVICE" : "INDEPENDENT_SERVICE"
        }&searchItem=${searchItem?.trim()}`;
        const response = await axios.get(
          ROOT_BASE_API + "ProductServices" + queryString
        );
        return {
          isAssociate: queryParams?.isAssociate,
          products: response?.data,
        };
      } catch (e: any) {
        console.log(e);
      }
    }
  );

export const getProductsTilesData = createAsyncThunk(
  "getProducts/tilesData",
  async () => {
    try {
      const response = await axios.get(ROOT_BASE_API + "Products/tiles");
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productsTiles = createAsyncThunk(
  "productsAdd/tiles",
  async (classification: string) => {
    let URL = ROOT_BASE_API + "Products/tiles";
    URL =
      classification === "ALL_PRODUCTS"
        ? URL
        : `${URL}?productClassification=${classification}`;

    try {
      const response = await axios.get(URL);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const fetchProductSearchData = createAsyncThunk(
  "productSources/fetchSearchData",
  async (data: { [key: string]: number | string }) => {
    let URL =
      ROOT_BASE_API +
      `Products?active=true&skip=${data.skip}&limit=${data.limit}&appType=admin&searchItem=${data.searchItem}`;
    URL =
      data?.classification === "ALL_PRODUCTS"
        ? URL
        : `${URL}&productClassification=${data.classification}`;

    try {
      const response = await axios.get(URL);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const checkProductManualCodeUniqueness = createAsyncThunk(
  "productsAdd/productCodeUniqueness",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(
        ROOT_BASE_API + "Products/uniquecodecheck",
        data
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const checkBarCodeUniqueness = createAsyncThunk(
  "productsAdd/checkBarCodeUniqueness",
  async ({ barcode }: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + "Products/checkbarcodeunique",
        { params: { barcode }, validateStatus:null }
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const clearProductInformation = createAsyncThunk(
  "productsAdd/clearProductInformation",
  async () => {
    try {
      return {};
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productAdd = createSlice({
  name: "productsAdd",
  initialState: {
    data: {
      productSource: [],
      unitOfMeasures: [],
      addedProducts: [],
      skuCodes: [],
      associateServiceProducts: [],
      associateServiceSearchedProducts: [],
      assignedAssociateServiceProducts: [],
      assignedAssociateServiceSearchedProducts: [],
      independentServiceProducts: [],
      independentServiceSearchedProducts: [],
      assignedIndependentServiceProducts: [],
      assignedIndependentServiceSearchedProducts: [],
      tilesData: {
        totalCount: 0,
        totalInactive: 0,
        totalSellOnOnline: 0,
        totalSellOnPos: 0,
      },
      listData: [],
      searchData: [],
      totalCount: [],
      associateServiceProductsTotalCount: 0,
      associateServiceSearchedProductsTotalCount: 0,
      assignedAssociateServiceProductsTotalCount: 0,
      assignedAssociateServiceSearchedProductsTotalCount: 0,
      independentServiceProductsTotalCount: 0,
      independentServiceSearchedProductsTotalCount: 0,
      assignedIndependentServiceProductsTotalCount: 0,
      assignedIndependentServiceSearchedProductsTotalCount: 0,
    },
    UOMlookups: [],
    singleProduct: {},
    message: [],
    toggleMessage: [],
    isLoading: [],
    totalCount: [],
    isAssociateServicesLoading: false,
    isAssociateServicesSearchLoading: false,
    isAssignedAssociateServicesLoading: false,
    isAssignedAssociateServicesSearchLoading: false,
    isIndependentServicesLoading: false,
    isIndependentServicesSearchLoading: false,
    isAssignedIndependentServicesLoading: false,
    isAssignedIndependentServicesSearchLoading: false,
    productListData: [],
    error: "",
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsListData.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(fetchProductsListData.fulfilled, (state, action) => {
      // state.data = action.payload?.data;
      state.data.listData = action.payload.data;
      state.data.totalCount = action.payload?.totalCount;
      state.isLoading = false;
    });

    builder.addCase(fetchProductsListData.rejected, (state, action) => {
      // state.error = action.error?.message;
      state.isLoading = false;
    });
    builder.addCase(productSources.fulfilled, (state, action) => {
      state.data = { ...state.data, productSource: action.payload?.data };
    });
    builder.addCase(getUnitOfMeasure.fulfilled, (state, action) => {
      state.data.unitOfMeasures = action.payload?.data;
    });
    builder.addCase(productsGet.pending, (state, action) => {
      state.isLoading = true;
    });
    // builder.addCase(productsGet.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.data.addedProducts = action.payload?.data;
    // });
    builder.addCase(productsGet.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data.addedProducts = action.payload?.data;
    });
    builder.addCase(productsGet.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getSKUcodes.fulfilled, (state, action) => {
      state.data = { ...state.data, skuCodes: action.payload?.data }; // Update skuCodes property
    });
    builder.addCase(getProductsByServiceType.pending, (state, action) => {
      if (action?.meta?.arg?.isAssociate) {
        state.isAssociateServicesLoading = true;
      } else {
        state.isIndependentServicesLoading = true;
      }
    });
    builder.addCase(getProductsByServiceType.rejected, (state, action) => {
      if (action?.meta?.arg?.isAssociate) {
        state.isAssociateServicesLoading = false;
      } else {
        state.isIndependentServicesLoading = false;
      }
    });
    builder.addCase(getProductsByServiceType.fulfilled, (state, action) => {
      if (action.payload?.isAssociate) {
        state.isAssociateServicesLoading = false;
        state.data = {
          ...state.data,
          associateServiceProducts: action.payload?.products?.data,
          associateServiceProductsTotalCount:
            action.payload?.products?.totalCount,
        };
      } else {
        state.isIndependentServicesLoading = false;
        state.data = {
          ...state.data,
          independentServiceProducts: action.payload?.products?.data,
          independentServiceProductsTotalCount:
            action.payload?.products?.totalCount,
        };
      }
    });
    builder.addCase(getSearchProductsByServiceType.pending, (state, action) => {
      if (action?.meta?.arg?.isAssociate) {
        state.isAssociateServicesSearchLoading = true;
      } else {
        state.isIndependentServicesSearchLoading = true;
      }
    });
    builder.addCase(
      getSearchProductsByServiceType.rejected,
      (state, action) => {
        if (action?.meta?.arg?.isAssociate) {
          state.isAssociateServicesSearchLoading = false;
        } else {
          state.isIndependentServicesSearchLoading = false;
        }
      }
    );
    builder.addCase(
      getSearchProductsByServiceType.fulfilled,
      (state, action) => {
        if (action.payload?.isAssociate) {
          state.isAssociateServicesSearchLoading = false;
          state.data.associateServiceSearchedProducts =
            action.payload?.products?.data;
          state.data.associateServiceSearchedProductsTotalCount =
            action.payload?.products?.totalCount;
        } else {
          state.isIndependentServicesSearchLoading = false;
          state.data.independentServiceSearchedProducts =
            action.payload?.products?.data;
          state.data.independentServiceSearchedProductsTotalCount =
            action.payload?.products?.totalCount;
        }
      }
    );
    builder.addCase(
      getAssignedServicesOfProductsByServiceType.pending,
      (state, action) => {
        if (action?.meta?.arg?.isAssociate) {
          state.isAssignedAssociateServicesLoading = true;
        } else {
          state.isAssignedIndependentServicesLoading = true;
        }
      }
    );
    builder.addCase(
      getAssignedServicesOfProductsByServiceType.rejected,
      (state, action) => {
        if (action?.meta?.arg?.isAssociate) {
          state.isAssignedAssociateServicesLoading = false;
        } else {
          state.isAssignedIndependentServicesLoading = false;
        }
      }
    );
    builder.addCase(
      getAssignedServicesOfProductsByServiceType.fulfilled,
      (state, action) => {
        if (action.payload?.isAssociate) {
          state.isAssignedAssociateServicesLoading = false;
          state.data.assignedAssociateServiceProducts =
            action.payload?.products?.data;
          state.data.assignedAssociateServiceProductsTotalCount =
            action.payload?.products?.totalCount;
        } else {
          state.isAssignedIndependentServicesLoading = false;
          state.data.assignedIndependentServiceProducts =
            action.payload?.products?.data;
          state.data.assignedIndependentServiceProductsTotalCount =
            action.payload?.products?.totalCount;
        }
      }
    );
    builder.addCase(
      getSearchAssignedServicesOfProductsByServiceType.pending,
      (state, action) => {
        if (action?.meta?.arg?.isAssociate) {
          state.isAssignedAssociateServicesSearchLoading = true;
        } else {
          state.isAssignedIndependentServicesSearchLoading = true;
        }
      }
    );
    builder.addCase(
      getSearchAssignedServicesOfProductsByServiceType.rejected,
      (state, action) => {
        if (action?.meta?.arg?.isAssociate) {
          state.isAssignedAssociateServicesSearchLoading = false;
        } else {
          state.isAssignedIndependentServicesSearchLoading = false;
        }
      }
    );
    builder.addCase(
      getSearchAssignedServicesOfProductsByServiceType.fulfilled,
      (state, action) => {
        if (action.payload?.isAssociate) {
          state.isAssignedAssociateServicesSearchLoading = false;
          state.data.assignedAssociateServiceSearchedProducts =
            action.payload?.products?.data;
          state.data.assignedAssociateServiceSearchedProductsTotalCount =
            action.payload?.products?.totalCount;
        } else {
          state.isAssignedIndependentServicesSearchLoading = false;
          state.data.assignedIndependentServiceSearchedProducts =
            action.payload?.products?.data;
          state.data.assignedIndependentServiceSearchedProductsTotalCount =
            action.payload?.products?.totalCount;
        }
      }
    );
    builder.addCase(getProductsTilesData.fulfilled, (state, action) => {
      state.data.tilesData = action.payload;
    });
    builder.addCase(fetchProductSearchData.fulfilled, (state, action) => {
      state.data.searchData = action.payload?.data || [];
      state.data.totalCount = action.payload?.totalCount || [];
    });
    builder.addCase(productsGetById.fulfilled, (state, action) => {
      state.singleProduct = action.payload;
    });
    builder.addCase(getUOMLookups.fulfilled, (state, action) => {
      state.UOMlookups = action.payload?.data;
    });
    builder.addCase(clearProductInformation.pending, (state, action) => {
      state.singleProduct = {};
    });
    builder.addCase(clearProductInformation.rejected, (state, action) => {
      state.singleProduct = {};
    });
    builder.addCase(clearProductInformation.fulfilled, (state, action) => {
      state.singleProduct = {};

      state.data.associateServiceProducts = [];
      state.data.associateServiceSearchedProducts = [];
      state.data.independentServiceProducts = [];
      state.data.independentServiceSearchedProducts = [];

      state.data.assignedAssociateServiceProducts = [];
      state.data.assignedAssociateServiceSearchedProducts = [];
      state.data.assignedIndependentServiceProducts = [];
      state.data.assignedIndependentServiceSearchedProducts = [];
    });
  },
});

export default productAdd.reducer;
