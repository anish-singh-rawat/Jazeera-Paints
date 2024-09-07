// usersSlice.js

import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    updateUserAssign: (state, action) => {
        
      const item = action.payload;
      const findUser = state.some((d) => d?.id === item?.id);

      if (!findUser) {
        state.push(item);
      } else {
        return state.filter((d) => d?.id !== item?.id);
      }
    },

    clearUsers:()=>{
        return []
    },
    deleteUnassigned:(state,action)=>{
        const userIdToDelete = action.payload;
        return state.filter((user) => user?.id !== userIdToDelete);
    }
    
  },
});

export const { updateUserAssign, clearUsers , deleteUnassigned } = usersSlice.actions;

export default usersSlice.reducer;
