import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    assestList: builder.query({
      query: () => ({
        url: "all-assests",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [TAGS.ROLES],
    }),
  }),
});

export const {
  useAssestListQuery,
} = roleApi;