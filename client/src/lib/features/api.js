import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_BACKEND_DEV
    }),
    tagTypes: ['Auth'],
    endpoints: () => ({})
})