import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

// ** Axios Imports
import { axiosInstance as axios } from "src/configs/axios";
import { sortItemsByName } from "src/utils/utils";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchProductgroupsdropdown = createAsyncThunk(
  "productdropdown/fetchProductgroupsdropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "Productgroups/dropdown");

    return response.data;
  }
);

export const fetchproductdivisionsdropdown = createAsyncThunk(
  "productdropdown/fetchproductdivisionsdropdown",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "productdivisions/dropdown"
    );

    return response.data;
  }
);

export const fetchproductbrandsdropdown = createAsyncThunk(
  "productdropdown/fetchproductbrandsdropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "productbrands/dropdown");

    return response.data;
  }
);

export const fetchProductfamilydropdown = createAsyncThunk(
  "productdropdown/fetchProductfamilydropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "Productfamily/dropdown");

    return response.data;
  }
);

export const fetchProductcategorydropdown = createAsyncThunk(
  "productdropdown/fetchProductcategorydropdown",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "Productcategory/dropdown"
    );
    return response.data;
  }
);

export const fetchProductsubcategorydropdown = createAsyncThunk(
  "productdropdown/fetchProductsubcategorydropdown",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "Productsubcategory/dropdown"
    );

    return response.data;
  }
);

export const fetchProductAttributesdropdown = createAsyncThunk(
  "productdropdown/fetchProductAttributesdropdown",
  async () => {
    const response = await axios.get(
      ROOT_BASE_API + "ProductAttributes/dropdown"
    );

    return response.data;
  }
);
export const fetchUnitOfMeasuresdropdown = createAsyncThunk(
  "productdropdown/fetchUnitOfMeasuresdropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "UnitOfMeasures/dropdown");

    return response.data;
  }
);

export const fetchProductTypedropdown = createAsyncThunk(
  "productdropdown/fetchProductTypedropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductTypes/dropdown");
    return response.data;
  }
);

export const fetchProductAttribute01dropdown = createAsyncThunk(
  "productdropdown/fetchProductAttribute01dropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductAttribute01/dropdown");
    return response.data;
  }
);

export const fetchProductAttribute02dropdown = createAsyncThunk(
  "productdropdown/fetchProductAttribute02dropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductAttribute02/dropdown");
    return response.data;
  }
);

export const fetchProductAttribute03dropdown = createAsyncThunk(
  "productdropdown/fetchProductAttribute03dropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductAttribute03/dropdown");
    return response.data;
  }
);

export const fetchProductAttribute04dropdown = createAsyncThunk(
  "productdropdown/fetchProductAttribute04dropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductAttribute04/dropdown");
    return response.data;
  }
);

export const fetchProductAttribute05dropdown = createAsyncThunk(
  "productdropdown/fetchProductAttribute05dropdown",
  async () => {
    const response = await axios.get(ROOT_BASE_API + "ProductAttribute05/dropdown");
    return response.data;
  }
);

type store = {
  Productgroups: [];
  productdivisions: [];
  productbrands: [];
  Productfamily: [];
  Productcategory: [];
  Productsubcategory: [];
  ProductAttributes: [];
  UnitOfMeasures: [];
  ProductTypes: [];
  attribute1: [];
  attribute2: [];
  attribute3: [];
  attribute4: [];
  attribute5: [];
};

const initialState: store = {
  Productgroups: [],
  productdivisions: [],
  productbrands: [],
  Productfamily: [],
  Productcategory: [],
  Productsubcategory: [],
  ProductAttributes: [],
  UnitOfMeasures: [],
  ProductTypes: [],
  attribute1: [],
  attribute2: [],
  attribute3: [],
  attribute4: [],
  attribute5: [],
};

export const productdropdown = createSlice({
  name: "productdropdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductgroupsdropdown.fulfilled, (state, action) => {
      state.Productgroups = sortItemsByName(action.payload?.data);
    });
    builder.addCase(
      fetchproductdivisionsdropdown.fulfilled, (state, action) => {
        state.productdivisions = sortItemsByName(action.payload?.data);
      }
    );
    builder.addCase(fetchproductbrandsdropdown.fulfilled, (state, action) => {
      state.productbrands = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductfamilydropdown.fulfilled, (state, action) => {
      state.Productfamily = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductcategorydropdown.fulfilled, (state, action) => {
      state.Productcategory = sortItemsByName(action.payload?.data);
    });
    builder.addCase(
      fetchProductsubcategorydropdown.fulfilled, (state, action) => {
        state.Productsubcategory = sortItemsByName(action.payload?.data);;
      }
    );
    builder.addCase(
      fetchProductAttributesdropdown.fulfilled, (state, action) => {
        state.ProductAttributes = sortItemsByName(action.payload?.data);;
      }
    );
    builder.addCase(fetchUnitOfMeasuresdropdown.fulfilled, (state, action) => {
      state.UnitOfMeasures =  sortItemsByName(action.payload?.data);;
    });
    builder.addCase(fetchProductTypedropdown.fulfilled, (state, action) => {
      state.ProductTypes = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductAttribute01dropdown.fulfilled, (state, action) => {
      state.attribute1 = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductAttribute02dropdown.fulfilled, (state, action) => {
      state.attribute2 = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductAttribute03dropdown.fulfilled, (state, action) => {
      state.attribute3 = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductAttribute04dropdown.fulfilled, (state, action) => {
      state.attribute4 = sortItemsByName(action.payload?.data);
    });
    builder.addCase(fetchProductAttribute05dropdown.fulfilled, (state, action) => {
      state.attribute5 = sortItemsByName(action.payload?.data);
    });
  },
});
export default productdropdown.reducer;

