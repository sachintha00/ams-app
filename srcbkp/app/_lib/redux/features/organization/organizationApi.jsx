import { apiSlice } from "../api/api_slice";

export const organizationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewNodeToOrganization: builder.mutation({
      query: ({ parent_node_id, level, data }) => ({
        url: "added-new-node-to-organization",
        method: "POST",
        body: { parent_node_id, level, data },
        credentials: "include",
      }),
    }),
    getOrganizationList: builder.query({
      query: () => ({
        url: "retrieve-organization",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetOrganizationListQuery,
  useAddNewNodeToOrganizationMutation,
} = organizationApi;
