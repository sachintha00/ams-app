import { apiSlice } from "../api/api_slice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewRole: builder.mutation({
      query: ({ name }) => ({
        url: "addroles",
        method: "POST",
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzlhMDcwM2E1OGFiMWY2YzFmNjMxY2JlOWMxZjU2OWMxZmFmNTcyOGNiOGZjZWYxNzgzMjA3YzliMDZmN2ZhMDZjMjI2NzBiZTEyYzRmYzEiLCJpYXQiOjE3MTI1NjcxNDguNzgyNjQ0LCJuYmYiOjE3MTI1NjcxNDguNzgyNjQ3LCJleHAiOjE3NDQxMDMxNDguNzc0NDMsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.KD3GGS3sDaV9cHK_6WD01ohVAvgCUqRVDazJdIY1WYmj15ktM84cV8L7d9XQ7V-YDzC8mN7YJNRM9sVZv0UiVhF1TBPFX7__tnll5yLJz99d6LVYgOlTcgE5NABFZap6o1lBeW7mQd_2NdsF5BpxUiuMrorjmT4p_kvdUez-dz2RlojQFVpyu8UGN0g5FbP277miz8aMFo9wmgXSr-RQIbDeix6ybpCA2cq48c2PCIlGFgJe51IG6PKDRCJFMxZD4V-H1UtwtyK0ugRllvgIQiVkvnKe3m_klZckZXdAbaZWuA-3PwpTSNPGYyqTSr-Vqm-hPJLVwGmyz_ncHlZqhIwfGvrXTJb64OHNUhW-hw8Tu1Ydl7i6-cPAqbVZSZkzCrAzOMVhUf2T-vp2xS8jr7aN8X8TJM0X4bP7-dCr-LVFDUZJdoeXxYP99595nfSAkrYCLMjieLa7eVITmQYT2MfHy2tXVmCtd7SHheCYPN8ctHwnxQS7oEKlpLjigm32cKF3-LUxGXh9PbcUs5ntJOabtTGxiYNzua3m2vmeAx77DixtU3e8mllwI71HRP7t0Hfe_Y4ssU9nGzwJwd2sB89gkcEOVZelIarzqAzfs2Z_h6U_mvN5iUpUU936mPzuU09XItwSe6nqOT5N2-IsshxzgcTWx_3670vxhbfQ7nw`,
        },
        body: { name },
        credentials: "include",
      }),
    }),
    rolesList: builder.query({
      query: () => ({
        url: "allroles",
        method: "GET",
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMzlhMDcwM2E1OGFiMWY2YzFmNjMxY2JlOWMxZjU2OWMxZmFmNTcyOGNiOGZjZWYxNzgzMjA3YzliMDZmN2ZhMDZjMjI2NzBiZTEyYzRmYzEiLCJpYXQiOjE3MTI1NjcxNDguNzgyNjQ0LCJuYmYiOjE3MTI1NjcxNDguNzgyNjQ3LCJleHAiOjE3NDQxMDMxNDguNzc0NDMsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.KD3GGS3sDaV9cHK_6WD01ohVAvgCUqRVDazJdIY1WYmj15ktM84cV8L7d9XQ7V-YDzC8mN7YJNRM9sVZv0UiVhF1TBPFX7__tnll5yLJz99d6LVYgOlTcgE5NABFZap6o1lBeW7mQd_2NdsF5BpxUiuMrorjmT4p_kvdUez-dz2RlojQFVpyu8UGN0g5FbP277miz8aMFo9wmgXSr-RQIbDeix6ybpCA2cq48c2PCIlGFgJe51IG6PKDRCJFMxZD4V-H1UtwtyK0ugRllvgIQiVkvnKe3m_klZckZXdAbaZWuA-3PwpTSNPGYyqTSr-Vqm-hPJLVwGmyz_ncHlZqhIwfGvrXTJb64OHNUhW-hw8Tu1Ydl7i6-cPAqbVZSZkzCrAzOMVhUf2T-vp2xS8jr7aN8X8TJM0X4bP7-dCr-LVFDUZJdoeXxYP99595nfSAkrYCLMjieLa7eVITmQYT2MfHy2tXVmCtd7SHheCYPN8ctHwnxQS7oEKlpLjigm32cKF3-LUxGXh9PbcUs5ntJOabtTGxiYNzua3m2vmeAx77DixtU3e8mllwI71HRP7t0Hfe_Y4ssU9nGzwJwd2sB89gkcEOVZelIarzqAzfs2Z_h6U_mvN5iUpUU936mPzuU09XItwSe6nqOT5N2-IsshxzgcTWx_3670vxhbfQ7nw`,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddNewRoleMutation,
  useRolesListQuery,
} = roleApi;