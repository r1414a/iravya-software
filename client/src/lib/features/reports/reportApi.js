// lib/features/reports/reportApi.js

import { api } from "../api";

export const reportApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET /reports?page=1&limit=10&issue_type=&reported_by=&trip_id=&search=
        getReports: builder.query({
            query: ({ page = 1, limit = 10, issue_type = "", search = "" } = {}) => {
                const params = new URLSearchParams();
                params.set("page", page);
                params.set("limit", limit);
                if (issue_type)   params.set("issue_type", issue_type);
                // if (reported_by)  params.set("reported_by", reported_by);   // "driver" | "store"
                if (search)       params.set("search", search);              // tracking code / store / truck
                return {url: `/api/v1/issues/reports?${params.toString()}`, skipToast: true};
            },
            providesTags: ["Reports"],
            transformResponse: (res) => ({
                data:        res.data.data ?? [],
                pagination:  res.data.pagination ?? { page: 1, total_pages: 1, total: 0 },
            }),
        }),

    }),
});

export const { useGetReportsQuery } = reportApi;