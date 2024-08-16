import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../auth/auth_slice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}api/v1`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const email = getState().auth.user.email;
    const token = getState().auth.accessToken;
    if (email) {
      headers.set('Email', email);
    }
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 401) {
    console.log('sending refresh token');

    const refreshResult = await baseQuery('/refresh', api, extraOptions);
    console.log(refreshResult);

    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Workflows", "WorkflowDetails", "ApprovalAlert", "AssestRequisition", "Roles", "Users", "AssestManagement"],
  endpoints: (builder) => ({}),
});