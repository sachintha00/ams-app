import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getprofileimage: builder.mutation({
      query: ({ Filename }) => ({
        url: `profile-image/${Filename}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
    useGetprofileimageMutation,
} = roleApi;
