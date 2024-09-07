import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchProductdivisionspricelist = createAsyncThunk(
  "pricelist/productdivisions",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "productdivisions/pricelist"
    );
    return response.data;
  }
);

export const fetchProductbrandspricelist = createAsyncThunk(
  "pricelist/productbrands",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "productbrands/pricelist");

    return response.data;
  }
);
export const fetchproductcategorypricelist = createAsyncThunk(
  "pricelist/productcategory",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "productcategory/pricelist"
    );

    return response.data;
  }
);
export const fetchproductsubcategorypricelist = createAsyncThunk(
  "pricelist/productsubcategory",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "productsubcategory/pricelist"
    );

    return response.data;
  }
);
export const fetchproductgroupspricelist = createAsyncThunk(
  "pricelist/productgroups",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "productgroups/pricelist");

    return response.data;
  }
);
export const fetchProducttypesspricelist = createAsyncThunk(
  "pricelist/producttypes",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "producttypes/pricelist");

    return response.data;
  }
);
export const fetchProductfamilypricelist = createAsyncThunk(
  "pricelist/productfamily",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "productfamily/pricelist");

    return response.data;
  }
);

type store = {
  addProductdivisions: [];
  addProductbrands: [];
  addProductcategory: [];
  addProductsubcategory: [];
  addProductgroups: [];
  addProducttypes: [];
  addProductfamily: [];
};
const initialState: store = {
  addProductdivisions: [],
  addProductbrands: [],
  addProductcategory: [],
  addProductsubcategory: [],
  addProductgroups: [],
  addProducttypes: [],
  addProductfamily: [],
};

export const AddProductPricelist = createSlice({
  name: "pricelistaddproduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProductdivisionspricelist.fulfilled,
      (state, action) => {
        state.addProductdivisions = Array.isArray(action.payload.data)
          ? action.payload.data.filter((d) => d?.active)
          : [];
      }
    );
    builder.addCase(fetchProductbrandspricelist.fulfilled, (state, action) => {
      state.addProductbrands = Array.isArray(action.payload.data)
        ? action.payload.data.filter((d) => d?.active)
        : [];
    });
    builder.addCase(
      fetchproductcategorypricelist.fulfilled,
      (state, action) => {
        state.addProductcategory = Array.isArray(action.payload.data)
          ? action.payload.data.filter((d) => d?.active)
          : [];
      }
    );
    builder.addCase(
      fetchproductsubcategorypricelist.fulfilled,
      (state, action) => {
        state.addProductsubcategory = Array.isArray(action.payload.data)
          ? action.payload.data.filter((d) => d?.active)
          : [];
      }
    );
    builder.addCase(fetchproductgroupspricelist.fulfilled, (state, action) => {
      state.addProductgroups = Array.isArray(action.payload.data)
        ? action.payload.data.filter((d) => d?.active)
        : [];
    });
    builder.addCase(fetchProducttypesspricelist.fulfilled, (state, action) => {
      state.addProducttypes = Array.isArray(action.payload.data)
        ? action.payload.data.filter((d) => d?.active)
        : [];
    });
    builder.addCase(fetchProductfamilypricelist.fulfilled, (state, action) => {
      state.addProductfamily = Array.isArray(action.payload.data)
        ? action.payload.data.filter((d) => d?.active)
        : [];
    });
  },
});
export default AddProductPricelist.reducer;
