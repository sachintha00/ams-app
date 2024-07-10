import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layout: [],
  design: "",
};

const dragableSurfaceSlice = createSlice({
  name: "dragableSurface",
  initialState,
  reducers: {
    addItem: (state, action) => {
      console.log(action);
      state.layout.push(action.payload);
      state.design = action.payload.style;
    },
    updateLayout: (state, action) => {
      state.layout = action.payload;
    },
  },
});

export const { addItem, updateLayout } = dragableSurfaceSlice.actions;
export default dragableSurfaceSlice.reducer;
