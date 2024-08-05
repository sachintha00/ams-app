import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const procurementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitProcurementForm: builder.mutation({
      query: (formData) => {
        const { requwetsid, date, selected_items, selected_suppliers, rpf_document, attachment, requered_date, comment, status } = formData;
        const form = new FormData();
        form.append('requwetsid', requwetsid);
        form.append('date', date);
        form.append('selected_items', JSON.stringify(selected_items));
        form.append('selected_suppliers', JSON.stringify(selected_suppliers));
        
        rpf_document.forEach((file, index) => {
          form.append(`rpf_document[${index}]`, file);
        });

        attachment.forEach((file, index) => {
          form.append(`attachment[${index}]`, file);
        });

        form.append('requered_date', requered_date);
        form.append('comment', comment);
        form.append('status', status);

        console.log(form);

        return {
          url: 'procurement/send-quation',
          method: 'POST',
          body: form,
          credentials: 'include',
        };
      },
      invalidatesTags: [TAGS.PROCUREMENT],
    }),
    allApprovedRequisitionData: builder.query({
      query: () => ({
        url: "asset-requisition/all-approved",
        method: "GET",
        credentials: "include",
      }),
    }),
    allProcurementIds: builder.query({
      query: () => ({
        url: "procurement/ids",
        method: "GET",
        credentials: "include",
      }),
    }),
    allProcurementDetailsList: builder.query({
      query: () => ({
        url: "procurement/0",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [TAGS.SUPPLIERQUOTATION, TAGS.PROCUREMENT],
    }),
    allProcurementDetailsListByUser: builder.query({
      query: () => ({
        url: "procurement/by-user/0",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [TAGS.SUPPLIERQUOTATION, TAGS.PROCUREMENT],
    }),
    SubmitProcurementToWorkflow: builder.mutation({
      query: ({ procurement_id, date, selected_items }) => ({
        url: "procurement/submit-procurement",
        method: "PUT",
        body: { procurement_id, date, selected_items },
        credentials: "include",
      }),
      invalidatesTags: [TAGS.PROCUREMENT],
    }),
  }), 
});

export const {
  useSubmitProcurementFormMutation,
  useAllApprovedRequisitionDataQuery,
  useAllProcurementIdsQuery, 
  useAllProcurementDetailsListQuery,
  useAllProcurementDetailsListByUserQuery,
  useSubmitProcurementToWorkflowMutation,
} = procurementApi;