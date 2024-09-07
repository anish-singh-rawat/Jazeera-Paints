import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { Dispatch } from "redux";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

interface User {
  id: string;
  // Add other user properties as needed
}

export const getUserassigned = createAsyncThunk(
  "getUserassigned",
  async (data: any) => {
    const response = await axios.get(ROOT_BASE_API + `users/?roleId=${data}`);
    return response.data;
  }
);

interface AssignedUsersState {
  data: User[];
  error: any;
  message: any;
  isLoading: boolean;
}

const initialState: AssignedUsersState = {
  data: [],
  error: null,
  message: null,
  isLoading: false,
};

export const assignedUsersSlice = createSlice({
  name: "assignedUsers",
  initialState,

  reducers: {
    addAssignedUser: (state = initialState, action: PayloadAction<User>) => {
      state?.data.unshift(action.payload);
    },

    removeAssignedUser: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        data: state.data.filter((user) => user.id !== action.payload.id),
      };
    },
    deleteAssignedUser: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        data: state.data.filter((user) => user.id !== action.payload),
      };
    },
    clearAssignedUsers: (state) => {
      return {
        ...state,
        data: [],
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUserassigned.pending, (state) => {
      state.isLoading = true;
      state.data =[]
    });
   

    builder.addCase(
      getUserassigned.fulfilled,
      (state, action: PayloadAction<any>) => {
        const responseData = action.payload.data;

        if (responseData && Array.isArray(responseData)) {
          state.data = responseData;
        } else {
          // Handle the case where the response data is not as expected
          console.error("Invalid data structure in API response");
        }

        state.isLoading = false;
      }
    );

    builder.addCase(getUserassigned.rejected, (state) => {
      state.isLoading = false;
      state.data =[]
    });
  },
});

export const {
  addAssignedUser,
  removeAssignedUser,
  deleteAssignedUser,
  clearAssignedUsers,
} = assignedUsersSlice.actions;

export default assignedUsersSlice.reducer;
