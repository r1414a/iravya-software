// import { api } from "../api";

// export const userApi = api.injectEndpoints({
//     endpoints: (builder) => ({
//         getAllDrivers: builder.query({
//             query: ({page = 1, limit = 10}) => ({
//                 url: `/api/v1/users/all_users?page=${page}&limit=${limit}`,
//                 skipToast: true
//             })
//         }),
//         createUser: builder.mutation({
//             query: (formData) => ({
//                 url: "/api/v1/users/signup",
//                 method: "POST",
//                 body: formData
//             })
//         })
//     })
// })
