import { apiSlice } from "../api/api_slice";

export const workflowApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getworkflows: builder.query({
      query: (workflowId = 0) => ({
        url: `workflow/retrieve-workflow/${workflowId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, workflowId) =>
        result
          ? [{ type: "Workflows", id: workflowId }]
          : [{ type: "Workflows", id: "LIST" }],
    }),
    getworkflowDetailsList: builder.query({
      query: (workflowId) => ({
        url: `workflow/retrieve-workflow-details/${workflowId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, workflowId) =>
        result ? [{ type: "WorkflowDetails", id: workflowId }] : [],
    }),
    getworkflowDetailNodes: builder.query({
      query: (workflowDetailId = 0) => ({
        url: `workflow/retrieve-workflow-detail-nodes/${workflowDetailId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, workflowDetailId) =>
        result ? [{ type: "WorkflowDetails", id: workflowDetailId }] : [],
    }),
    addWorkflow: builder.mutation({
      query: (node) => ({
        url: "workflow/added-new-workflow",
        method: "POST",
        body: node,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workflows", id }],
    }),
    updateWorkflow: builder.mutation({
      query: (node) => ({
        url: "workflow/update-workflow",
        method: "PUT",
        body: node,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workflows", id }],
    }),
    addWorkflowOrConditionNode: builder.mutation({
      query: (node) => ({
        url: "workflow/added-new-workflow-details",
        method: "POST",
        body: node,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { workflowId }) => [
        { type: "WorkflowDetails", id: workflowId },
      ],
    }),
    updateWorkflowOrConditionNode: builder.mutation({
      query: (node) => ({
        url: "workflow/update-workflow-details",
        method: "PUT",
        body: node,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { workflowDetailId }) => [
        { type: "WorkflowDetails", id: workflowDetailId },
      ],
    }),
    deleteWorkflowNode: builder.mutation({
      query: (nodeId) => ({
        url: `workflow/remove-workflow/${nodeId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workflows", id }],
    }),
    deleteWorkflowDetailNode: builder.mutation({
      query: (nodeId) => ({
        url: `workflow/remove-workflow-details/${nodeId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { workflowId }) => [
        { type: "WorkflowDetails", id: workflowId },
      ],
    }),
    designationsRetrieveFromQuerySearch: builder.mutation({
      query: ({ query }) => ({
        url: `workflow/retrieve-all-designation-from-search?query=${query}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetworkflowDetailsListQuery,
  useAddWorkflowOrConditionNodeMutation,
  useGetworkflowsQuery,
  useAddWorkflowMutation,
  useDeleteWorkflowNodeMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowDetailNodeMutation,
  useGetworkflowDetailNodesQuery,
  useUpdateWorkflowOrConditionNodeMutation,
  useDesignationsRetrieveFromQuerySearchMutation
} = workflowApi;

export default workflowApi;
