import { apiSlice } from "../api/api_slice";
import { dashboardItem } from "./drawerItemSlice";

export const dashboardWidgetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDrawerWidget: builder.mutation({
      query: () => ({
        url: "drawer_item",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result.data);
          //   dispatch(
          //     userLoggedIn({
          //       accessToken: result.data.access_token,
          //       user: result.data.user,
          //     })
          //   );
        } catch (error) {
          console.log("error");
        }
      },
    }),
    getDashboardWidget: builder.mutation({
      query: () => ({
        url: "dashboard_item",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(dashboardItem(result.data));
        } catch (error) {
          console.log("error");
        }
      },
    }),
  }),
});

export const { useGetDrawerWidgetMutation, useGetDashboardWidgetMutation } =
  dashboardWidgetApi;
