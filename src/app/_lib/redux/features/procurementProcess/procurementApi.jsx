import { apiSlice } from "../api/api_slice";

export const procurementApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProcurementStaff: builder.query({
            query: () => ({
                url: "procurement/get-all-staff",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ['ProcurementStaff'],
        }),
        addNewMemberToProcurementStaff: builder.mutation({
            query: (procurementStaff) => ({
                url: "procurement/add-new-member",
                method: "POST",
                body: procurementStaff,
                credentials: "include",
            }),
            invalidatesTags: ['ProcurementStaff'],
        }),
        removeMemberFromProcurementStaff: builder.mutation({
            query: (procurementStaffId) => ({
                url: `procurement/staff-remove/${procurementStaffId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ['ProcurementStaff'],
        }),
        updateMemberFromProcurementStaff: builder.mutation({
            query: (procurementStaff) => ({
                url: `procurement/staff-update`,
                method: "PUT",
                body: procurementStaff,
                credentials: "include",
            }),
            invalidatesTags: ['ProcurementStaff'],
        }),
    }),
});

export const {
    useGetProcurementStaffQuery,
    useAddNewMemberToProcurementStaffMutation,
    useRemoveMemberFromProcurementStaffMutation,
    useUpdateMemberFromProcurementStaffMutation
} = procurementApi;