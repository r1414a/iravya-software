import { api } from "../api";

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCountData: builder.query({
            query: () => ({
                url: "/api/v1/analytics/count",
                method: "GET",
                skipToast: true
            }),
            transformResponse: (res) => ({
                data: res.data ?? []
            })
        }),

        getGraphData: builder.query({
            query: ({ year, month, date }) => {
                const params = {
                    year,
                    ...(month && { month }),
                    ...(date && { date }),
                };

                return {
                    url: "/api/v1/analytics/graphs",
                    method: "GET",
                    params, // if your baseQuery supports params (axios style)
                    skipToast: true
                };
            },
            transformResponse: (res) => res.data ?? {},
        }),
    }),
});

export const {
    useGetCountDataQuery,
    useGetGraphDataQuery
} = analyticsApi;