import { api } from "../api";


export const brandApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllBrands: builder.query({
            query: () => ({
                url: "/api/v1/brands",
                skipToast: true
            }),
        })
    })
})

export const {
    useGetAllBrandsQuery
} = brandApi