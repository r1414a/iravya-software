import { api } from "../api"

// lib/features/trips/tripApi.js

export const tripApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // GET /trips?page=1&limit=10&status=&search=
        getAllTrips: builder.query({
            query: ({ page = 1, limit = 10, status = "", search = "", city = "" } = {}) => {
                const params = new URLSearchParams()
                params.set("page", page)
                params.set("limit", limit)
                if (status) params.set("status", status)
                if (search) params.set("search", search)
                if (city) params.set("city", city)
                return {
                    url: `/api/v1/trips/trips?${params.toString()}`,
                    skipToast: true,
                }
            },
            providesTags: ["Trips"],
        }),

        // POST /data - Get available trucks, drivers, GPS devices, stores for creating trip
        // getTripFormData: builder.mutation({
        //     query: (body) => ({
        //         url: "/api/v1/trips/data",
        //         method: "POST",
        //         body,
        //     }),
        // }),

        // POST /trip - Create new trip
        addTrip: builder.mutation({
            query: (body) => ({
                url: "/api/v1/trips/trip",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Trips"],
        }),

        // PUT /cancel/:id - Cancel trip
        cancelTrip: builder.mutation({
            query: (id) => ({
                url: `/api/v1/trips/cancel/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Trips"],
        }),

        // POST /track-trip - Track trip by tracking code (public endpoint)
        trackTrip: builder.mutation({
            query: (body) => ({
                url: "/api/v1/trips/track-trip",
                method: "POST",
                body,
            }),
        }),

        getTrucks: builder.query({
            query: ({ page = 1, limit = 10, search = "", departed_at }) => {
                const params = new URLSearchParams()
                params.set("page", page)
                params.set("limit", limit)
                if (search) params.set("search", search)
                if (departed_at) params.set("departed_at", departed_at)

                return {
                    url: `/api/v1/trips/trucks?${params.toString()}`,
                    skipToast: true,
                }
            },
        }),

        getDrivers: builder.query({
            query: ({ page = 1, limit = 10, search = "", departed_at }) => {
                const params = new URLSearchParams()
                params.set("page", page)
                params.set("limit", limit)
                if (search) params.set("search", search)
                if (departed_at) params.set("departed_at", departed_at)

                return {
                    url: `/api/v1/trips/drivers?${params.toString()}`,
                    skipToast: true,
                }
            },
        }),

        getGpsDevices: builder.query({
            query: ({ page = 1, limit = 10, search = "", departed_at }) => {
                const params = new URLSearchParams()
                params.set("page", page)
                params.set("limit", limit)
                if (search) params.set("search", search)
                if (departed_at) params.set("departed_at", departed_at)

                return {
                    url: `/api/v1/trips/gps-devices?${params.toString()}`,
                    skipToast: true,
                }
            },
        }),

        getStores: builder.query({
            query: ({ page = 1, limit = 10, search = "" }) => {
                const params = new URLSearchParams()
                params.set("page", page)
                params.set("limit", limit)
                if (search) params.set("search", search)

                return {
                    url: `/api/v1/trips/stores?${params.toString()}`,
                    skipToast: true,
                }
            },
        }),

    }),
})

export const {
    useGetAllTripsQuery,
    useGetTripFormDataMutation,
    useAddTripMutation,
    useCancelTripMutation,
    useTrackTripMutation,
    useGetTrucksQuery,
    useLazyGetTrucksQuery,
    useGetDriversQuery,
    useLazyGetDriversQuery,
    useGetGpsDevicesQuery,
    useLazyGetGpsDevicesQuery,
    useGetStoresQuery,
    useLazyGetStoresQuery
} = tripApi