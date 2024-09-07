//users/unassignedusers

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { RootState } from "src/store";

export interface UserTypePermission {
  permissionId: number;
  permissions?: {
    id: number;
    name: string;
    createdBy: string;
  };
}

export interface UserTypeDataObject {
  id: number;
  uuid: string;
  active: boolean;
  createdOn: string;
  updatedOn: string;
  tenantId: number;
  companyId: number;
  name: string;
  altName: string;
  userTypePermissions: UserTypePermission[];
}

export const getUserTypePermission = createAsyncThunk(
  "getUserPermission",
  async (data: any) => {
    const searchString =
      data != 99999990
        ? `Usertypepermissions?userTypeId=${data}`
        : `Usertypepermissions`;
    const response = await axios.get(searchString);
    return response.data;
  }
);

export interface Store {
  data: {
    userTypePermission: UserTypeDataObject[];
  };
  error: any;
  message: any;
  isLoading: boolean;
}
const initialState: Store = {
  isLoading: false,
  error: [],
  message: [],
  data: {
    userTypePermission: [],
  },
};

export const UserPermission = createSlice({
  name: "getUserPermission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserTypePermission.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserTypePermission.fulfilled, (state, action) => {
      state.data.userTypePermission = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getUserTypePermission.rejected, (state, action) => {
      state.error = action.error.message;
      state.isLoading = false;
    });
  },
});

export default UserPermission.reducer;
