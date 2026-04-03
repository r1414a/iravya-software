const { api } = require("../api");

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/users/signin",
                method: "POST",
                body: {email},
            })
        }),

        //login,getMe,logout
    })
})

export const {
    // useLoginMutation
} = authApi