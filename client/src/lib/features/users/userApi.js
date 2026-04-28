import { api } from "../api";

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ page = 1, limit = 10, search = "", status = "", role = "" } = {}) => {
                const p = new URLSearchParams({ page, limit })
                if (search) p.set("search", search)
                if (status) p.set("status", status)
                if (role) p.set("role", role)
                return { url: `/api/v1/users/users_by_search?${p}`, skipToast: true }
            },
            providesTags: ["Users"],
        }),
        getAvailableManagers: builder.query({
            query: ({ page = 1, limit = 10, search = "" } = {}) => {
                const p = new URLSearchParams({ page, limit });
                if (search) p.set("search", search);

                return {
                    url: `/api/v1/dc/managers?${p}`,
                    skipToast: true,
                };
            },
            providesTags: ["Managers"],
        }),

        createUser: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/users/signup",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Users"],
        }),
        updateUser: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/api/v1/users/update_user/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Users"],
        }),
        // DELETE /deleteDc/:id
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/v1/users/delete_user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
        setUserPassword: builder.mutation({
            query: ({ id, password }) => ({
                url: `/api/v1/users/password/${id}`,
                method: "POST",
                body: { password }
            }),
            invalidatesTags: ["Users"]
        }),

    })
})

export const {
    useGetAllUsersQuery,
    useGetAvailableManagersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useSetUserPasswordMutation
} = userApi