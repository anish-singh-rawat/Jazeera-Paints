import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "src/configs/axios";
import { Dispatch } from "redux";

interface ApiResponse<T> {
  data: T;
}
interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface TaxGroup {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  lookupTypesCode: string;
}

export interface TaxGroupsListType {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
  createdOn: string;
  updatedOn: string;
  tenantId: number;
  companyId: number;
  externalReference: string;
  tenant: {
    id: number;
    uuid: string;
    code: string;
    name: string;
    altName: string;
    active: boolean;
  };
  company: {
    id: number;
    uuid: string;
    code: string;
    name: string;
    altName: string;
    active: boolean;
  };
  taxGroupType: string;
}

export type SingleTaxGroup = Omit<TaxGroupsListType, "tenant" | "company">;

// Define the payload interface for creating a new tax group
export interface CreateTaxGroupPayload {
  code: string;
  name: string;
  altName: string;
  externalReference: string;
  active: boolean;
  taxGroupType: string;
  companyId?: number;
  tenantId?: number;
}

export interface CreateTaxGroupResponse {
  id: number;
  message: string;
}

type stateType = {
  loading: boolean;
  error: null | string;
  listGroupsLoading: boolean;
  data: {
    taxGroups: TaxGroup[];
    listGroups: TaxGroupsListType[];
    currentGroup: SingleTaxGroup;
  };
};

const initialState: stateType = {
  loading: false,
  error: null,
  listGroupsLoading: false,
  data: {
    taxGroups: [],
    listGroups: [],
    currentGroup: {
      code: "",
      active: false,
      id: 0,
      name: "",
      altName: "",
      externalReference: "",
      createdOn: "",
      updatedOn: "",
      uuid: "",
      tenantId: 0,
      companyId: 0,
      taxGroupType: "",
    },
  },
};

// Create an async thunk for fetching tax groups from the API endpoint
export const fetchTaxGroups = createAsyncThunk("taxGroups/fetch", async () => {
  const response = await axiosInstance.get<ApiResponse<TaxGroup[]>>(
    "lookupvalues?lookupTypesCode=TAX_GROUP_TYPES"
  );
  return response.data.data;
});

export const TaxGroupsList = createAsyncThunk(
  "taxGroups/taxGroupList",
  async () => {
    const response = await axiosInstance.get<ApiResponse<TaxGroupsListType[]>>(
      "/taxgroups"
    );
    return response.data.data;
  }
);

export const createTaxGroup = createAsyncThunk(
  "taxGroups/create",
  async (payload: CreateTaxGroupPayload) => {
    const response = await axiosInstance.post<CreateTaxGroupResponse>(
      "/taxGroups",
      payload
    );
    return response.data;
  }
);

export const updateTaxGroup = createAsyncThunk(
  "taxGroups/update",
  async (payload: Partial<SingleTaxGroup>) => {
    const response = await axiosInstance.patch<CreateTaxGroupResponse>(
      "/taxGroups",
      payload
    );
    return response.data;
  }
);

export const fetchTaxGroupById = createAsyncThunk(
  "taxGroups/fetchById",
  async ({ id }: { id: number }) => {
    const response = await axiosInstance.get<ApiResponse<SingleTaxGroup>>(
      `/taxgroups/${id}`
    );
    return response.data;
  }
);

export const taxGroupDelete = createAsyncThunk(
  "taxgroups/deleteItem",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axiosInstance.delete(`taxgroups/${data.id}`);
      await dispatch(TaxGroupsList());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
const taxGroupSlice = createSlice({
  name: "taxGroups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.data.taxGroups = action.payload;
      })
      .addCase(fetchTaxGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(TaxGroupsList.pending, (state) => {
        state.listGroupsLoading = true;
        state.error = null;
      })
      .addCase(TaxGroupsList.fulfilled, (state, action) => {
        state.listGroupsLoading = false;
        state.data.listGroups = action.payload;
      })
      .addCase(TaxGroupsList.rejected, (state, action) => {
        state.listGroupsLoading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(fetchTaxGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.data.currentGroup = action.payload.data;
      })
      .addCase(fetchTaxGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export default taxGroupSlice.reducer;
