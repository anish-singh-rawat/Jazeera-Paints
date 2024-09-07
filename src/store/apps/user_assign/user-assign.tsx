import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const RolePermissionsCreate = createAsyncThunk(
  "rolePermissions/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      if (data?.userTypeId == 99999990) {
        delete data.userTypeId
      }
      const response = await axios.post(
        ROOT_BASE_API + "RolePermissions",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);






export const RolePermissionsUpdate = createAsyncThunk(
  "rolePermissions/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      if (data?.userTypeId == 99999990) {
        delete data.userTypeId
      }
      const response = await axios.patch(
        ROOT_BASE_API + "RolePermissions",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Stro {
  data: any;
  error: any;
  message: any;
  isLoading: boolean;
}

export const UserRolePermission = createSlice({
  name: "RolelePermissions",
  initialState: { data: [], isLoading: false, error: [], message: [] } as Stro,
  reducers: {},

});



export default UserRolePermission.reducer;
