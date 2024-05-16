import { createSlice } from "@reduxjs/toolkit";

const updateConditionsSlice = createSlice({
  name: "updateConditions",
  initialState: {},
  reducers: {
    updateCondition: (state, action) => {
      const { nodeId, condition } = action.payload;
      if (!state[nodeId]) {
        state[nodeId] = [];
      }
      state[nodeId].push(condition);
    },
    removeUpdateCondition: (state, action) => {
      const { nodeId, index } = action.payload;
      if (state[nodeId]) {
        state[nodeId] = state[nodeId].filter((_, idx) => idx !== index);
      }
    },
    setConditionsForNode: (state, action) => {
      const { nodeId, conditions } = action.payload;
      state[nodeId] = conditions;
    },
    clearConditionsForNode: (state, action) => {
      const { nodeId } = action.payload;
      delete state[nodeId];
    },
  },
});

export const {
  updateCondition,
  removeUpdateCondition,
  setConditionsForNode,
  clearConditionsForNode,
} = updateConditionsSlice.actions;
export default updateConditionsSlice.reducer;
