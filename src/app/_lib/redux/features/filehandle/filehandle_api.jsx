import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getprofileimage: builder.mutation({
      query: ({ imagename }) => ({
        url: `profile-image/${imagename}`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: [TAGS.USERS],
    }),
    getthumbnailimage: builder.mutation({
      query: ({ imagename }) => ({
        url: `assets-image/${imagename}`,
        method: "GET",
        credentials: "include",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
    useGetprofileimageMutation,
    useGetthumbnailimageMutation,
} = roleApi;
