import { apiSlice } from "../api/api_slice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userLogout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZTRkMzVjOWYxNzZiZTcxOTc1MGUzZGYwNWU2YjcyYjkzZjg4NmJhZjg2NmM5M2JlYTNmMWNjNmI3N2NlODIwOGU1ZDdiNTg4YmM2YzIwNmQiLCJpYXQiOjE3MTM0MTc0MTUuMTgzNTkyLCJuYmYiOjE3MTM0MTc0MTUuMTgzNTk0LCJleHAiOjE3NDQ5NTM0MTUuMTcyOTkzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.cKWwYTX_b5FIP3HeITHNRA5wQPMbLS0s1gmCXDrdMVHU-6udvhfbJ3GleoFJPPc2AGcvbpumY-BJElwXY0DtPGWPrg2koR4IIbbaEdS9mr7XQP6p0mnlfxIrlRwGBQ_xeFaGmgw6Boltm35hsrtBUdOWPMx8J9f5b8a0abSGrw9X4bhY4Fw_3egN35qT_tXdrVKi0eWFufG4OYSUNRiWICfPPF8pZsLM_bSngSVdxHaZPfVYmJ9I-4nuEdjXdcvr6grLcExACBBmaEYDjcci5N2fzRyXkLaASyvRH_PJxTYmJb-wgoUDzfCr2GoCuhOoF3Uuds-CTQiqF5fsMDhjgMA4RFSxxBs0FrMvzJX7lr0LLaP3R6ZJ3APfA6mEEJ0BZ7m-HDbZcMu2eIRxvaopk_sOPSUpSFoUw9TQNY5kMqv3iwqCTNpsMtVPJRSlrisO-hMTFgK5UblL64MFzDqqYdMNG9mIlwV_pQBvSujqqaSPsX0T5YD1bCe_qHuqRQtxcXxz0fwj6N08EoKPZhAfZDQrWdZW_10_nsOhz2pEOQaGVQHYdVe2hZLz04mDbOBEtHYEoeK4nvWifd5l_2UaCt40K9oogXu4JgwL8TajnpVwIYHraxAhZ6I0REPLa6AtgLX1sBkWholexwt3bEq1_oBK0sGW9CPhFz4i5RDbI8w`,
        // },
        credentials: "include",
      }),
    }),
  }),
});

export const {
    useUserLogoutMutation,
} = roleApi;