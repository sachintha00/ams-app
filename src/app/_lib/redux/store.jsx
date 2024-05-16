"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/api_slice";
import authReducer from "./features/auth/auth_slice";
import organizationReducer from "./features/assestrequisition/organization_slice";
import dragableSurfaceReducer from "./features/dashboard/dragableSurfaceSlice";
import drawerItemReducer from "./features/dashboard/drawerItemSlice";
import conditionsReducer from "./features/workflow/condtionsSlice";
import updateConditionsReducer from "./features/workflow/updateConditionSlice";
import pageHeaderReducer from "./features/pageHeader/pageHeaderSlice";
import popupModelReducer from "./features/popupModel/popupModelSlice";
import requestTypeSliceReducer from "./features/requisitionsapproval/requestTypeSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    organization: organizationReducer,
    dragableSurface: dragableSurfaceReducer,
    dashboardItem: drawerItemReducer,
    conditions: conditionsReducer,
    pageHeader: pageHeaderReducer,
    popupModel: popupModelReducer,
    updateConditions: updateConditionsReducer,
    requestType: requestTypeSliceReducer,
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
