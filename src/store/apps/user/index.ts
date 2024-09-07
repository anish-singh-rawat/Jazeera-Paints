// ** Redux Imports
import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import UserData from "src/store/apps/user";

// ** Axios Imports
import axios from "axios";
import { log } from "console";

interface DataParams {
  q: string;
  role: string;
  status: string;
  currentPlan: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

const DEV_API = "http://3.94.234.108:8000/customer/save";
const LOCAL_API = "http://172.50.17.192:8000/customer/save";

// ** Fetch Users
export const fetchData = createAsyncThunk(
  "appCustomers/fetchData",
  async (data: { [key: string]: number | string }) => {
    const response = await axios.post(
      "http://3.94.234.108:8000/customer/search",
      data
    );

    return response.data;
  }
);

// ** Delete User
export const deleteUser = createAsyncThunk(
  "appUsers/deleteUser",
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete("/apps/users/delete", {
      data: id,
    });
    dispatch(fetchData(getState().user.params));

    return response.data;
  }
);

export const appUsersSlice = createSlice({
  name: "appUsers",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users;
      state.total = action.payload.total;
      state.params = action.payload.params;
      state.allData = action.payload.allData;
    });
  },
});

export default appUsersSlice.reducer;
