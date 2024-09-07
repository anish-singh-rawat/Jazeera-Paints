

import { createSlice } from "@reduxjs/toolkit";

const formDataSlice = createSlice({
  name: "formData",
  initialState: {
    userName: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
    email:"",
    code:""

  },
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setNewpassword:(state, action)=> {
      state.newpassword = action.payload
    },
    setConfirPassword:(state, action)=>{
      state.confirmpassword = action.payload
    },
    setEmail:(state, action)=>{
      state.email = action.payload
    },
    setCode:(state, action)=>{
      state.code = action.payload
    }

  },
});

export const { setUserName, setPassword , setNewpassword , setConfirPassword , setEmail,setCode} = formDataSlice.actions;
export default formDataSlice.reducer;
