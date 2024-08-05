import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    approvelAlert: builder.query({
      query: () => ({
        url: "workflow/approvel-alert",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [TAGS.APPROVAL_ALERT],
    }),
    requestApprove: builder.mutation({
      query: ({ request_id, workflow_node_id, workflow_id, requisition_id, approver_comment, designaion_user_id, request_type_id, status }) => ({
        url: "workflow/request-approve",
        method: "POST",
        body: { request_id, workflow_node_id, workflow_id, requisition_id, approver_comment, designaion_user_id, request_type_id, status },
        credentials: "include",
      }),
      invalidatesTags: [TAGS.APPROVAL_ALERT],
    }),
    requestReject: builder.mutation({
      query: ({ request_id, workflow_node_id, workflow_id, requisition_id, approver_comment, designaion_user_id, request_type_id, status }) => ({
        url: "workflow/request-reject",
        method: "POST",
        body: { request_id, workflow_node_id, workflow_id, requisition_id, approver_comment, designaion_user_id, request_type_id, status },
        credentials: "include",
      }),
      invalidatesTags: [TAGS.APPROVAL_ALERT],
    }),
  }),
});

export const {
  useApprovelAlertQuery,
  useRequestApproveMutation,
  useRequestRejectMutation,
} = roleApi; 
