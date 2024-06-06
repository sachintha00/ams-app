import { apiSlice } from "../api/api_slice";

export const drawerItemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDrawerItemList: builder.query({
      query: () => ({
        url: "dashboard/get-drawer-item-list",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetDrawerItemListQuery } = drawerItemApi;
