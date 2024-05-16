import { createSlice } from "@reduxjs/toolkit";

const organizationSlice = createSlice({
  name: "organization",
  initialState: null,
  reducers: {
    getorganizationid: (state, action) => action.payload,
  },
});

export const { getorganizationid } = organizationSlice.actions;
export default organizationSlice.reducer;