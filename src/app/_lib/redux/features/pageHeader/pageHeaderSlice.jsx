import { createSlice } from "@reduxjs/toolkit";

const pageHeaderSlice = createSlice({
  name: "pageHeader",
  initialState: { view: "grid", searchQuery: "" },
  reducers: {
    handleSwitchView: (state, action) => {
      state.view = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { handleSwitchView, setSearchQuery } = pageHeaderSlice.actions;
export default pageHeaderSlice.reducer;
