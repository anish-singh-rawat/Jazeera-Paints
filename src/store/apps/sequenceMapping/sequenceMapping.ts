import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";
import { ROOT_BASE_API } from "..";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const sequenceMappingCodeSearch = createAsyncThunk(
  "sequenceMappingCode/fetchData",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        ROOT_BASE_API + `SequenceMapping/code?code=${data?.entityType}`,
        {
          validateStatus:null
        }
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
}

export const sequenceMappingCode = createSlice({
  name: "sequenceMappingCodeSearch",
  initialState: { data: [], message: [], isLoading: [] } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sequenceMappingCodeSearch.fulfilled, (state, action) => {
      state.data = action?.payload;
      state.isLoading = false;
    });
  },
});

export default sequenceMappingCode.reducer;
