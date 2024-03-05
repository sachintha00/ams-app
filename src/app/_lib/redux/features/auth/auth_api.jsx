import { apiSlice } from "../api/api_slice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./auth_slice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result)
          dispatch(
            userLoggedIn({
              accessToken: result.data.access_token,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("error");
        }
      },
    }),
    
  }),
});

export const { useLoginMutation } = authApi;
