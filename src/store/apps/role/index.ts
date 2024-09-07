// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import { axiosInstance as axios } from "src/configs/axios";

interface DataParams {
  q: string;
}

// ** Fetch Invoices
export const getRoles = createAsyncThunk(
  "role/fetchData",
  async () => {
    const response = await axios.get("role");
    return response.data;
  }
);

export const roles = createSlice({
  name: "role",
  initialState: {
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });
  },
});

export default roles.reducer;
