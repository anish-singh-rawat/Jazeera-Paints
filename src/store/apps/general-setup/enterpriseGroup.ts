import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

// import { fetchCustomerGroup } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchGroupTenant = createAsyncThunk(
  "tenantGroup",
  async (params: { [key: string]: number | string | any }) => {
    const apiUrl = ROOT_BASE_API + "Tenant";
    const response = await axios.get(apiUrl, {params});

    return response.data;
  }
);
export const tenantGroupGetById = createAsyncThunk(
  "tenantGroup/getById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(ROOT_BASE_API + `Tenant/${data.id}`);
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const deleteSingleGroup = createAsyncThunk(
  "tenantGroup/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(ROOT_BASE_API + `Tenant/${data.id}`);

      dispatch(fetchGroupTenant({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const createTenantGroup = createAsyncThunk(
  "tenantGroup/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.post(ROOT_BASE_API + "Tenant", data);

      dispatch(fetchGroupTenant({ data: "all" }));
      //   dispatch(fetchCustomerGroup());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const updateGroupTenant = createAsyncThunk(
  "tenantGroup/updateGroupTenant",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(ROOT_BASE_API + "Tenant", data);

      dispatch(fetchGroupTenant({ data: "all" }));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);
export const fetchDeploymentModes = createAsyncThunk(
  "tenantGroup/fetchDeploymentModes",
  async (data: { [key: string]: number | string | any }) => {
    const apiUrl =
      ROOT_BASE_API + "lookupvalues?lookupTypesCode=DEPLOYMENT_MODES";
    const response = await axios.get(apiUrl);

    return response.data;
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
  deploymentModes: Array<{}>
}

export const groupTenant = createSlice({
  name: "groupTenant",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
    deploymentModes:[]
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGroupTenant.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(fetchGroupTenant.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDeploymentModes.fulfilled, (state, action) => {
      state.deploymentModes = action.payload.data;
    });
    builder.addCase(createTenantGroup.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createTenantGroup.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default groupTenant.reducer;
