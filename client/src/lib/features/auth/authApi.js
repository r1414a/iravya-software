import { api } from "../api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/users/signin",
                method: "POST",
                body: credentials,
            })
        }),
        getMe: builder.query({
            query: () => ({
                url: "/api/v1/users/me",
                skipToast: true
            })
        })

        //login,getMe,logout
    })
})

export const {
    useSignInMutation,
    useGetMeQuery
} = authApi