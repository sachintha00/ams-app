import { apiSlice } from "../api/api_slice";

export const assestrequisitionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        assestrequisitionList: builder.query({
            query: () => ({
              url: "all-assest-requisition",
              method: "GET",
              credentials: "include",
            }),
        }),
        addNewAssestRequisition: builder.mutation({
            query: ({ requisition_id, requisition_date, requisition_status, items }) => ({
              url: "add-assest-requisition",
              method: "POST",
              body: { requisition_id, requisition_date, requisition_status, items },
              credentials: "include",
            }),
        }),
        assestRequisitionStatusUpdate: builder.mutation({
            query: ({ requisition_id, requisition_status }) => ({
              url: "update-assest-requisition-status",
              method: "PUT",
              body: { requisition_id, requisition_status },
              credentials: "include",
            }),
        }),
    }),
})

export const {
  useRequestTypesQueryuseAssestrequisitionListQuery,
    useAddNewAssestRequisitionMutation,
    useAssestRequisitionStatusUpdateMutation,
    useAssestrequisitionListQuery,
  } = assestrequisitionApi;