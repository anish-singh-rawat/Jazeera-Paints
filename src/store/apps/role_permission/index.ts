// userTypesSlice.ts

import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import { axiosInstance } from "src/configs/axios";


interface ApiResponse<T> {
    data: T;
}

interface Redux {
    getState: any;
    dispatch: Dispatch<any>;
}

export interface UserTypes {
    id: number;
    uuid: string;
    name: string;
    altName: string;
    active: boolean;
}


export const fetchUserTypes: AsyncThunk<UserTypes[], void, {}> = createAsyncThunk("userTypes/fetch", async () => {
    const response = await axiosInstance.get<ApiResponse<UserTypes[]>>(
        "usertypes"
    );
    const allType: UserTypes = {
        id: 99999990,
        uuid: "",
        name: "ALL",
        altName: "ALL",
        active: true
    }
    return [allType, ...response.data.data.filter(d => d.active)];
});


interface UserTypesState {
    loading: boolean;
    error: any;
    data: UserTypes[]
}

const initialState: UserTypesState = {
    loading: false,
    error: null,
    data: [],
};

const userTypesSlice = createSlice({
    name: "userTypes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload as any;
            })
            .addCase(fetchUserTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "An error occurred";
            });
    },
});

export default userTypesSlice.reducer;

