import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

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
    getFirstApruvel: builder.mutation({
      query: ({ workflow_id, variable_values }) => ({
        url: "workflow/retrieve-first-aprover",
        method: "POST",
        body: { workflow_id, variable_values },
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
      query: ({ designation_user_id, workflow_request_type_id, workflow_id, requisition_id, budget_value, requisition_data_object }) => ({
        url: "workflow/request-process/submit-data",
        method: "POST",
        body: { designation_user_id, workflow_request_type_id, workflow_id, requisition_id, budget_value, requisition_data_object },
        credentials: "include", 
      }),
      invalidatesTags: [TAGS.ASSESTREQUISITION],
    }),
  }),
});

export const {
    useRequestTypesQuery,
    useRequestTypesWorkflowsMutation,
    useGetFirstApruvelMutation,
    useWorkflowAprovelListMutation,
    useSubmitRequisitionApprovelMutation,
} = roleApi;
