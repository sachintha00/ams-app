import { apiSlice } from "../api/api_slice";

export const roleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewRole: builder.mutation({
      query: ({ name, description }) => ({
        url: "addroles",
        method: "POST",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        body: { name, description },
        credentials: "include",
      }),
    }),
    rolesList: builder.query({
      query: () => ({
        url: "allroles",
        method: "GET",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        credentials: "include",
      }),
    }),
    editeRole: builder.mutation({
      query: ({ id, name, description }) => ({
        url: `rolesupdate/${id}`,
        method: "PUT",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        body: { name, description },
        credentials: "include",
      }),
    }),
    deleteRole: builder.mutation({
      query: ({ ID }) => ({
        url: `rolesdelete/${ID}`,
        method: "DELETE",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        credentials: "include",
      }),
    }),
    givePermissiontoRole: builder.mutation({
      query: ({ roleId, permission }) => ({
        url: `roles/${roleId}/give-permissions`,
        method: "PUT",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        body: { permission },
        credentials: "include",
      }),
    }),
    removePermissionfromRole: builder.mutation({
      query: ({ roleId, permission }) => ({
        url: `roles/${roleId}/remove-permissions`,
        method: "PUT",
        // headers: {
        //   Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiOTYyNTc0Yjg5YWZjODQ5NDUxYTU5NDdmNjkyMTJkMzM2MjVhODc4Y2Q1OTRlYWZkZmMyNWNmN2ZlOTk1ZTllODQxZTExY2Q3ZDY4NDEwZWUiLCJpYXQiOjE3MTM1MTM0MDMuMDAzMjk5LCJuYmYiOjE3MTM1MTM0MDMuMDAzMzAzLCJleHAiOjE3NDUwNDk0MDMuMDAwNDM0LCJzdWIiOiIxMSIsInNjb3BlcyI6W119.YnDSmgyLsvItuTfJeb8IN68wOD8U-v5su8hEm6LgOwr9s_5FKZvTrnbpkp3ypiXZyCnM0zc2BD8ku4rhrw951HeoKciqaufbgvyTId0oZNjcblR8LL2Amrs9qL_N5K7AZnZfChRz9o6W2uOKXWahMw1_wn7o0WE28Bf0yeBumUGzIRIy01MUnJg33oAHSyD-Ih-wX6A8gWA994qS5R9UCUCiNTu5d3Q6uPT8v2v48ZLc2jtYi49y96UlKPodq4Cm16zbMUuIqcgB-TVX3OUM24w70U2MlF199zdiLZs5DgtE9TxJYzMymhhMQiZVeGVVAnmMq6MFyc-FKH6aY1yikZ8FHiYHk0pvmiRSEIiR4Dvm1ghD-YE5B7SMyZmr2joBfgeLsN3xQuLSZW0saM--aYAc0d3fLbLzfnPKippHIj6R3UjQARnxVMWpJ9hRC8bjhc18gwk5yebWM3NaiSbCGxnFwwjAb33Ckb-uzA2XRQSGobEZEdjYI5cR3iHiZbNZtmUZbeCzPIpz82Y5Av9B1fxb8wYjWtcimX0XaMDCCcQZqzPWkJCPb_32GSfCFnZ14xjOPWew48U-THiV0wQUhmq75I5lt_YGwl-3hx-zIPIYoVe8F_mlH8JTX-q2QQwPaIQ6-9CT_v4S43wxltwHBtoXJu6xJ6BCVXM8pZYpFjs`,
        // },
        body: { permission },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddNewRoleMutation,
  useRolesListQuery,
  useEditeRoleMutation,
  useDeleteRoleMutation,
  useGivePermissiontoRoleMutation,
  useRemovePermissionfromRoleMutation,
} = roleApi;