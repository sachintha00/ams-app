import { createSlice } from "@reduxjs/toolkit";

const drawerItemSlice = createSlice({
  name: "dashboardItem",
  initialState: { drawerItem: {} },
  reducers: {
    drawerItem: (state, action) => {
      state.drawerItem = action.payload.drawerItem;
    },
    dashboardItem: (state, action) => {
      state.drawerItem = action.payload;
    },
  },
});

export const { drawerItem, dashboardItem } = drawerItemSlice.actions;
export default drawerItemSlice.reducer;
