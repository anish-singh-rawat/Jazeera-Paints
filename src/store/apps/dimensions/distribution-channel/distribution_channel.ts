import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "../..";
import { fetchDistributionChannel } from "../../customers";
import { fetchDistributiondropdownchannel } from "../../customer_dropdown/customer_dropdown";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const distributionChannelSearch = createAsyncThunk(
  "distributionChannel/fetchData",
  async (data: { [key: string]: number | string | any }) => {
    // const response = await axios.post(ROOT_BASE_API + "distributionchannel/search", data);
    const response = await axios.get(ROOT_BASE_API + "distributionchannel?active=true");

    return response.data;
  }
);

export const distributionChannelGetById = createAsyncThunk(
  "distributionChannel/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "distributionchannel/id", data);
      const response = await axios.get(
        ROOT_BASE_API + `distributionchannel/${data.id}`
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const distributionChannelCreate = createAsyncThunk(
  "distributionChannel/create",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "distributionchannel/save", data);
      const response = await axios.post(
        ROOT_BASE_API + "distributionchannel",
        data
      );
      dispatch(fetchDistributiondropdownchannel());
      dispatch(distributionChannelSearch({}));
      dispatch(fetchDistributionChannel());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const distributionChannelUpdate = createAsyncThunk(
  "distributionChannel/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "distributionchannel/update", data);
      const response = await axios.patch(
        ROOT_BASE_API + "distributionchannel",
        data
      );

      dispatch(distributionChannelSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const distributionChannelDelete = createAsyncThunk(
  "distributionChannel/updateUser",
  async (data: any, { dispatch }: Redux) => {
    try {
      // const response = await axios.post(ROOT_BASE_API + "distributionchannel/delete", data);
      const response = await axios.delete(
        ROOT_BASE_API + `distributionchannel/${data.id}`
      );

      dispatch(distributionChannelSearch({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const distributionChannelToggle = createAsyncThunk(
  "distributionchannel/toggle",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch(
        ROOT_BASE_API + "distributionchannel/toggle",
        data
      );

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export interface Store {
  data: Array<{}>;
  message: any;
  isLoading: any;
  toggleMessage: any;
}

export const distributionChannel = createSlice({
  name: "distributionChannel",
  initialState: {
    data: [],
    message: [],
    isLoading: [],
    toggleMessage: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(distributionChannelSearch.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(distributionChannelSearch.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(distributionChannelCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(distributionChannelCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(distributionChannelDelete.fulfilled, (state, action) => {
      state.message = action?.payload;
    });
    builder.addCase(distributionChannelToggle.fulfilled, (state, action) => {
      state.toggleMessage = action?.payload;
    });
  },
});

export default distributionChannel.reducer;
