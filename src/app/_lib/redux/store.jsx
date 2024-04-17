"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/api_slice";
import authReducer from "./features/auth/auth_slice";
import dragableSurfaceReducer from "./features/dashboard/dragableSurfaceSlice";
import drawerItemReducer from "./features/dashboard/drawerItemSlice";


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    dragableSurface: dragableSurfaceReducer,
    dashboardItem: drawerItemReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});


// const initializeApp = async () => {
//   await store.dispatch(
//     apiSlice.endpoints.refreshToken.initiate({}, { forceRefetch: true })
//   );
//   await store.dispatch(
//     apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
//   );
// };

// initializeApp();
