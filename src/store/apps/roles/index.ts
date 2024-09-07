import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { axiosInstance } from "src/configs/axios";
import { PermissionType, RolePermission, UserType } from "src/context/types";

interface ApiResponse<T> {
  data: T;
}
interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export type Role = {
  id: number;
  name: string;
  active: boolean;
  userType?: {
    id: number;
    name: string;
    altName: string;
  };
  totalUsers: number;
  rolePermissions: RolePermission[];
};

type stateType = {
  loading: boolean;
  error: any;
  data: {
    role: Role[];
    roleById: singleRoleType;
  };
};

type roleType = {
  active: boolean;
  altName: string;
  id: number;
  name: string;
  uuid: string;
};

type permissionList = {
  id: number;
  userTypeId: number;
  name: string;
  userTypePermissionsList: {
    permissionId: number;
    permissionType: PermissionType;
    permissions: {
      id: number;
      name: string;
    }
  }[];
}

export type singleRoleType = {
  id: number;
  tenantId?: number;
  companyId?: number;
  name: string;
  code?: string;
  altName?: string;
  rolePermissions: permissionList[]
  userType?: Omit<UserType, "uuid">;
}


export const fetchRolesUsers = createAsyncThunk("role", async (data) => {
  const response = await axiosInstance.get<ApiResponse<Role[]>>(`role`);
  return response.data.data;
});

export const fetchRoles = createAsyncThunk("role", async (data: roleType) => {
  const response = await axiosInstance.get<ApiResponse<Role[]>>(
    data.id == 99999990 ? "role" : `role?userTypeId=${data.id}`
  );
  return response.data.data;
});

export const fetchusers = createAsyncThunk("/users", async () => {
  const response = await axiosInstance.get<ApiResponse<Role[]>>("users");
  return response.data.data;
});

export const fetchRolesById = createAsyncThunk(
  "roles/fetchbyId",
  async ({ roleId }: { roleId: string }) => {
    const response = await axiosInstance.get<singleRoleType>(`Rolepermissions/${roleId}`);
    if (!response.data?.userType) {
      response.data.userType = {
        id: 99999990,
        name: "ALL",
        altName: "ALL",
      };
    }
    return response.data as unknown as singleRoleType;
  }
);

export const copyNewRole = createAsyncThunk(
  "roles/copyNewRole",
  async (payload: Role) => {
    const response = await axiosInstance.post<ApiResponse<any>>(
      `Rolepermissions`,
      payload
    );
    return response.data as unknown as Role;
  }
);

const initialState: stateType = {
  loading: false,
  error: null,

  data: {
    role: [],
    roleById: {
      id: 0,
      tenantId: undefined,
      companyId: undefined,
      name: "",
      code: undefined,
      altName: undefined,
      rolePermissions: [],
      userType: undefined
    }
  },
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.data.role = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(fetchRolesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesById.fulfilled, (state, action) => {
        state.loading = false;
        state.data.roleById = action.payload;
      })
      .addCase(fetchRolesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      })
      .addCase(fetchusers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchusers.fulfilled, (state, action) => {
        state.loading = false;
        state.data.role = action.payload;
      })
      .addCase(fetchusers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred";
      });

    // .addCase(TaxGroupsList.pending, (state) => {
    //     state.listGroupsLoading = true;
    //     state.error = null;
    // })
    // .addCase(TaxGroupsList.fulfilled, (state, action) => {
    //     state.listGroupsLoading = false;
    //     state.data.listGroups = action.payload;
    // })
    // .addCase(TaxGroupsList.rejected, (state, action) => {
    //     state.listGroupsLoading = false;
    //     state.error = action.error.message ?? "An error occurred";
    // })
    // .addCase(fetchTaxGroupById.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    // })
    // .addCase(fetchTaxGroupById.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.data.currentGroup = action.payload.data;
    // })
    // .addCase(fetchTaxGroupById.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message ?? "An error occurred";
    // });
  },
});

export default rolesSlice.reducer;
