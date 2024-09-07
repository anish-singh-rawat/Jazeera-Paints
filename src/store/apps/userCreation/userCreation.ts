import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Store {
  data: Array<{}>;
  tilesData: {
    totalCount: number;
    totalInActiveCount: number;
    totalBackOfficeCount: number;
    totalPosCount: number;
    totalPosAndBackOfficeCount: number;
    totalActiveCount: number;
  };
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const getUserTilesData = createAsyncThunk(
  "userCreation/tiles",
  async () => {
    const response = await axios.get("/users/tiles");

    return response.data;
  }
);

export const getUserCreation = createAsyncThunk(
  "userCreation/fetchData",
  async ( data: { [key: string]: number | string | any },
    { dispatch }: Redux) => {
    const response = await axios.get("/users");
    dispatch(getUserTilesData());
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "userCreation/postData",
  async (
    data: { [key: string]: number | string | any },
    { dispatch }: Redux
  ) => {
    const response = await axios.post("/users", data);
    dispatch(getUserCreation({}));
    return response.data;
  }
);

export const userUpdate = createAsyncThunk(
  "user/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("users", data);

      dispatch(getUserCreation({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const userGetById = createAsyncThunk(
  "user/getsingleuser",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(`users/${data.id}`);

      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);



export const userDelete = createAsyncThunk(
  "user/delete",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.delete(`users`, {
        data: { id: data?.id },
      } as any);
      dispatch(getUserCreation({}));
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const userCreation = createSlice({
  name: "userCreation",
  initialState: {
    data: [],
    tilesData: {
      totalCount: NaN,
      totalInActiveCount: NaN,
      totalBackOfficeCount: NaN,
      totalPosCount: NaN,
      totalPosAndBackOfficeCount: NaN,
      totalActiveCount: NaN,
    },
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserCreation.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getUserCreation.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserCreation.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    builder.addCase(getUserTilesData.fulfilled, (state, action) => {
      state.tilesData = action.payload;
      // state.isLoading = false;
    });
  },
});

export default userCreation.reducer;
