import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance as axios } from "src/configs/axios";

export interface Stro {
    data: Array<{}>;
    message: any;
    isLoading: any;
};

interface Redux {
    getState: any;
    dispatch: Dispatch<any>;
}

export const customerProfiles = createAsyncThunk(
    "customerProfile/fetchData",
    async () => {
        const response = await axios.get("/Customerprofilesettings");
        return response.data;
      }
);

export const activeCustomerProfiles = createAsyncThunk(
    "customerProfile/fetchData",
    async () => {
        const response = await axios.get("/Customerprofilesettings/dropdown");
        return response.data;
      }
);

export const customerProfilesCreate = createAsyncThunk(
    "customerProfile/create",
    async (data: any, { dispatch }: Redux) => {

        const response = await axios.post("/Customerprofilesettings", data);

        dispatch(customerProfiles());

        return response.data;
    }
);

export const customerProfilesById = createAsyncThunk(
    "customerProfile/getByID",
    async (id: string) => {

        const response = await axios.get(`/Customerprofilesettings/${id}`);
        return response.data;
    }
);

export const customerProfilesUpdate = createAsyncThunk(
    "customerProfile/update",
    async (data: any, {dispatch}:Redux) => {

        const response = await axios.patch("/Customerprofilesettings",data);
        dispatch(customerProfiles())
        return response.data;
    }
);

export const customerProfileDelet = createAsyncThunk(
    "customerProfile/delete",
    async (id:string,{dispatch}:Redux) =>{
        const response = await axios.delete(`/Customerprofilesettings/${id}`);
        dispatch(customerProfiles())
        return response.data;
    }
)

export const customerProfile = createSlice({
    name: "customerProfile",
    initialState: {
        data: [],
        message: [],
        isLoading: [],
    } as Stro,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(customerProfiles.pending, (state, action) => {
            state.isLoading = true;
          });
        builder.addCase(customerProfilesCreate.pending, (state, action) => {
            state.isLoading = true;
          });
        builder.addCase(customerProfiles.fulfilled, (state, action) => {
            state.data = action.payload?.data;
            state.isLoading = false;
        });
        builder.addCase(customerProfiles.rejected, (state, action) => {
            state.isLoading = false;
        })
    },
});

export default customerProfile.reducer;