import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const requestTypeSlice = createSlice({
  name: "requestType",
  initialState,
  reducers: {
    handleRequestType: (state, action) => {
      const {
        value = null,
      } = action.payload || {};
      state.value = value;
    },
  },
});

export const { handleRequestType } =
  requestTypeSlice.actions;
export default requestTypeSlice.reducer;
