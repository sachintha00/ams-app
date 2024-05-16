import { apiSlice } from "../api/api_slice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestTypes: builder.query({
      query: () => ({
        url: "workflow/request-process/retrieve-all-request-types",
        method: "GET",
        credentials: "include",
      }),
    }),
    requestTypesWorkflows: builder.mutation({
      query: ({ ID }) => ({
        url: `workflow/request-process/relevant-workflows/${ID}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    workflowAprovelList: builder.mutation({
      query: ({ workflow_id, variable_values }) => ({
        url: "workflow/request-process/get-request-workflow",
        method: "POST",
        body: { workflow_id, variable_values },
        credentials: "include",
      }),
    }),
    submitRequisitionApprovel: builder.mutation({
      query: ({ user_id, workflow_request_type_id, workflow_id, requisition_data_object }) => ({
        url: "workflow/request-process/submit-data",
        method: "POST",
        body: { user_id, workflow_request_type_id, workflow_id, requisition_data_object },
        credentials: "include",
      }),
    }),
  }),
});

export const {
    useRequestTypesQuery,
    useRequestTypesWorkflowsMutation,
    useWorkflowAprovelListMutation,
    useSubmitRequisitionApprovelMutation,
} = roleApi;