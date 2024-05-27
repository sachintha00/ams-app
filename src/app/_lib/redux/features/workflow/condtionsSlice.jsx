import { createSlice } from "@reduxjs/toolkit";

const conditionsSlice = createSlice({
  name: "conditions",
  initialState: [],
  reducers: {
    addCondition: (state, action) => {
      state.push(action.payload);
    },
    removeCondition: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
  },
});

export const { addCondition, removeCondition } = conditionsSlice.actions;
export default conditionsSlice.reducer;
