import { apiSlice } from "../api/api_slice";
import { TAGS } from "../tags";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    assestList: builder.query({
      query: () => ({
        url: "all-assests",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [TAGS.ASSETSMANAGEMENT],
    }),
    submitAssestRegisterForm: builder.mutation({
      query: (formData) => {
        const { p_thumbnail_image, p_assets_type, p_category, p_sub_category, p_assets_value, p_assets_document, p_supplier, p_purchase_order_number, p_purchase_cost, p_purchase_type, p_received_condition, p_warranty, p_other_purchase_details, p_purchase_document, p_insurance_number, p_insurance_document, p_expected_life_time, p_depreciation_value, asset_details } = formData;

        const form = new FormData();

        p_thumbnail_image.forEach((file, index) => {
          form.append(`p_thumbnail_image[${index}]`, file);
        });
        form.append('p_assets_type', p_assets_type);
        form.append('p_category', p_category);
        form.append('p_sub_category', p_sub_category);
        form.append('p_assets_value', p_assets_value);

        p_assets_document.forEach((file, index) => {
          form.append(`p_assets_document[${index}]`, file);
        });

        form.append('p_supplier', p_supplier);
        form.append('p_purchase_order_number', p_purchase_order_number);
        form.append('p_purchase_cost', p_purchase_cost);
        form.append('p_purchase_type', p_purchase_type);
        form.append('p_received_condition', p_received_condition);
        form.append('p_warranty', p_warranty);
        form.append('p_other_purchase_details', p_other_purchase_details);

        p_purchase_document.forEach((file, index) => {
          form.append(`p_purchase_document[${index}]`, file);
        });

        form.append('p_insurance_number', p_insurance_number);

        p_insurance_document.forEach((file, index) => {
          form.append(`p_insurance_document[${index}]`, file);
        });

        form.append('p_expected_life_time', p_expected_life_time);
        form.append('p_depreciation_value', p_depreciation_value);
        form.append('p_asset_details', JSON.stringify(asset_details));

        console.log(form);

        return {
          url: 'add-new-assests',
          method: 'POST',
          body: form,
          credentials: 'include',
        };
      },
      invalidatesTags: [TAGS.ASSETSMANAGEMENT],
    }),
    deleteAssets: builder.mutation({
        query: ({ ID }) => ({
          url: `delete-asset/${ID}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: [TAGS.ASSETSMANAGEMENT],
    }),
  }),
});

export const {
  useAssestListQuery,
  useSubmitAssestRegisterFormMutation,
  useDeleteAssetsMutation,
} = roleApi;