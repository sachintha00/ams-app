import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewSupplierQuotation: builder.mutation({
      query: ({ date, procurement_id, selected_supplier_id, selected_items, AvailableDate }) => ({
        url: "procurement/quotation-feedback",
        method: "POST",
        body: { date, procurement_id, selected_supplier_id, selected_items, AvailableDate },
        credentials: "include",
      }),
      invalidatesTags: [TAGS.SUPPLIERQUOTATION],
    }), 
    UpdateSupplierQuotation: builder.mutation({
      query: ({ quotation_id, date, procurement_id, selected_supplier_id, selected_items, AvailableDate }) => ({
        url: "procurement/quotation-feedback/update",
        method: "PUT",
        body: { quotation_id, date, procurement_id, selected_supplier_id, selected_items, AvailableDate},
        credentials: "include",
      }),
      invalidatesTags: [TAGS.SUPPLIERQUOTATION],
    }),
    DeleteSupplierQuotation: builder.mutation({
      query: ({ ID }) => ({
        url: `procurement/quotation-feedback/${ID}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [TAGS.SUPPLIERQUOTATION],
    }),
    QuotationComplete: builder.mutation({
      query: ({ ID }) => ({
        url: `procurement/quotation-feedback/quotation_complete/${ID}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: [TAGS.SUPPLIERQUOTATION],
    }),
  }),
});

export const {
  useAddNewSupplierQuotationMutation, 
  useUpdateSupplierQuotationMutation,
  useDeleteSupplierQuotationMutation,
  useQuotationCompleteMutation,
} = roleApi;