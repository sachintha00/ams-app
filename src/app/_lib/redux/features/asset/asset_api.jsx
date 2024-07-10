import { apiSlice } from "../api/api_slice";

export const assetApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        assetList: builder.query({
            query: () => ({
                url: "asset/types",
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useAssetListQuery,
} = assetApi;