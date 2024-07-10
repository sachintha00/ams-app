import { createSlice } from "@reduxjs/toolkit";

const safeParseJSON = (item) => {
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error("Error parsing JSON", error);
    return null;
  }
};

const initialState = {
  user: null,
  accessToken: null,
  permissions: null,
  sidebaritem: null,
};

if (typeof window !== "undefined") {
  initialState.user = safeParseJSON(localStorage.getItem("user")) || null;
  initialState.accessToken = localStorage.getItem("accessToken") || null;
  initialState.permissions = localStorage.getItem("permissions") || null;
  initialState.sidebaritem = localStorage.getItem("sidebaritem") || null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.sidebaritem = action.payload.sidebaritem;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem(
          "permissions",
          JSON.stringify(action.payload.permissions)
        );
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem(
          "sidebaritem",
          JSON.stringify(action.payload.sidebaritem)
        );
      }
    },
  },
});

export const { userLoggedIn } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentAccessToken = (state) => state.auth.accessToken;
export const selectCurrentpermissions = (state) => state.auth.permissions;
export const selectCurrentsidebaritem = (state) => state.auth.sidebaritem;
