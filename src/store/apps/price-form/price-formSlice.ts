// formSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState: Record<string, any> = {

};

const PriceSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateField: (state: any, action) => {
      const {value, key } = action.payload;
      state[key] = value;
    },
    clearFields: (state: any) => {
      return {}
    },
  },
});

export const { updateField, clearFields } = PriceSlice.actions;
export default PriceSlice.reducer;
