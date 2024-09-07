import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export interface Store {
  data: Array<{}>;
  message: any;
  toggleMessage: any;
  isLoading: any;
}

export const productSerialNumbersGet = createAsyncThunk(
  "productserialnumbers/fetchData",
  async () => {
    const response = await axios.get("productserialnumbers");

    return response.data;
  }
);

export const productSerialNumbersGetById = createAsyncThunk(
  "productserialnumbers/GetById",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.get(
        `productserialnumbers/${data.id}`
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productSerialNumbersDelete = createAsyncThunk(
  "productserialnumbers/delete",
  async (id: number | string | any, { dispatch }: Redux) => {
    const response = await axios.delete(`productserialnumbers/${id?.id}`);
    dispatch(productSerialNumbersGet());

    return response.data;
  }
);

export const productSerialNumbersCreate = createAsyncThunk(
  "productserialnumbers/create",
  async(data:any,{dispatch}:Redux)=>{
    const res = await axios.post('productserialnumbers',data);
    dispatch(productSerialNumbersGet());
    return res.data
  }
);

export const productSerialNumbersUpdate = createAsyncThunk(
  "productserialnumbers/update",
  async (data: any, { dispatch }: Redux) => {
    try {
      const response = await axios.patch("productserialnumbers",data);

      dispatch(productSerialNumbersGet());
      return response.data;
    } catch (e: any) {
      console.log(e);
    }
  }
);

export const productSerialNumbersStore = createSlice({
  name: "productserialnumbers",
  initialState: {
    data: [],
    message: [],
    toggleMessage: [],
    isLoading: [],
  } as Store,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(productSerialNumbersGet.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(productSerialNumbersGet.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productSerialNumbersCreate.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(productSerialNumbersCreate.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(productSerialNumbersGet.rejected, (state, action) => {
      state.isLoading = false;
      state.data = [];
    });
    
  },
});

export default productSerialNumbersStore.reducer;
