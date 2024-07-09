import { FORM_TYPE } from "@/app/_lib/constants/formType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formStatus: false,
  formType: null,
  id: 0,
  value: null,
};

const popupModelSlice = createSlice({
  name: "popupModel",
  initialState,
  reducers: {
    handleOpenPopupModel: (state, action) => {
      const {
        id = 0,
        value = null,
        formType = FORM_TYPE.SUBMIT,
      } = action.payload || {};
      state.formStatus = true;
      state.id = id;
      state.value = value;
      state.formType = formType;
    },
    handleClosePopupModel: (state) => {
      state.formStatus = false;
      state.id = 0;
      state.value = null;
      state.formType = null;
    },
  },
});

export const { handleOpenPopupModel, handleClosePopupModel } =
  popupModelSlice.actions;
export default popupModelSlice.reducer;
