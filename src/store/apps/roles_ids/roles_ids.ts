// idsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const idsSlice = createSlice({
  name: 'ids',
  initialState: [],
  reducers: {
    toggleId: (state:any, action:any) => {
      const idIndex = state.findIndex((item:any) => item.id === action.payload);

      if (idIndex !== -1) {
        state.splice(idIndex, 1);
      } else {
        state.push({ id: action.payload });
      }
    },
    toggleIdClear:()=>{
    return []
    },
   
  },
});

export const { toggleId ,toggleIdClear} = idsSlice.actions;

export default idsSlice.reducer;
