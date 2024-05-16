import { apiSlice } from "../api/api_slice";

export const supplierApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupplierRegisterId: builder.query({
            query: () => ({
                url: "supplier/reg-no",
                method: "GET",
                credentials: "include",
            }),
        }),
        registerNewSupplier: builder.mutation({
            query: (supplier) => ({
                url: "supplier",
                method: "POST",
                body: supplier,
                credentials: "include",
            }),
        }),
        getAllSupplier: builder.query({
            query: () => ({
                url: "supplier/get-all",
                method: "GET",
                credentials: "include",
            }),
        }),
        getSupplierFromSearch: builder.mutation({
            query: ({ query, page }) => ({
                url: `supplier/search?query=${query}&page=${page}`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useGetSupplierRegisterIdQuery,
    useRegisterNewSupplierMutation,
    useGetAllSupplierQuery,
    useGetSupplierFromSearchMutation
} = supplierApi;