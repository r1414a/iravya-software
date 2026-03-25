const { api } = require("../api");

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // sendOtp: builder.mutation({
        //     query: (email) => ({
        //         url: "/api/auth/v1/send-otp",
        //         method: "POST",
        //         body: {email},
        //     })
        // }),

        //login,getMe,logout
    })
})

export const {
    // useLoginMutation
} = authApi