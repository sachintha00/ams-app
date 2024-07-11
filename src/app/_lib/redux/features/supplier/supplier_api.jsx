import { apiSlice } from "../api/api_slice";

export const supplierApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupplierRegisterId: builder.query({
            query: () => ({
                url: "supplier/reg-no",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["SupplierRegister"],
        }),
        registerNewSupplier: builder.mutation({
            query: (supplier) => ({
                url: "supplier",
                method: "POST",
                body: supplier,
                credentials: "include",
            }),
            invalidatesTags: ["SupplierRegister", "SupplierList"],
        }),
        getAllSupplier: builder.query({
            query: () => ({
                url: "supplier/get-all",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["SupplierList"],
        }),
        getSupplierFromSearch: builder.mutation({
            query: ({ query, page }) => ({
                url: `supplier/search?query=${query}&page=${page}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["SupplierList"],
        }),
        updateSupplier: builder.mutation({
            query: (supplier) => ({
                url: "supplier/update",
                method: "PUT",
                body: supplier,
                credentials: "include",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Supplier', id },
                "SupplierList",
            ],
        }),
        removeSupplier: builder.mutation({
            query: (supplierId) => ({
                url: `supplier/remove/${supplierId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, supplierId) => [
                { type: 'Supplier', id: supplierId },
                "SupplierList",
            ],
        }),
    }),
});

export const {
    useGetSupplierRegisterIdQuery,
    useRegisterNewSupplierMutation,
    useGetAllSupplierQuery,
    useGetSupplierFromSearchMutation,
    useUpdateSupplierMutation,
    useRemoveSupplierMutation
} = supplierApi;
