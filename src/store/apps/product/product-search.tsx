import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateNameAndId: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
    },
    clearProductData: (state:any) => {
      state.name = null;
      state.id = null;
    },
  },
});

export const { updateNameAndId , clearProductData} = productSlice.actions;
export default productSlice.reducer;
