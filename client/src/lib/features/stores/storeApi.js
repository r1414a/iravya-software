import { api } from "../api"

 
export const storeApi = api.injectEndpoints({
    endpoints: (builder) => ({
 
        // GET /stores?page=&limit=&search=&brand_id=&status=&city=
        getAllStores: builder.query({
            query: ({ page = 1, limit = 10, search = "", brand_id = "", status = "", city = "" } = {}) => {
                const p = new URLSearchParams({ page, limit })
                if (search)   p.set("search",   search)
                if (brand_id) p.set("brand_id", brand_id)
                if (status)   p.set("status",   status)
                if (city)     p.set("city",     city)
                return { url: `/api/v1/stores/stores?${p}`, skipToast: true }
            },
            // shape: { data: [], pagination: { total, page, limit, total_pages } }
            providesTags: ["Stores"]
            
            // providesTags: (result) =>
            //     result
            //         ? [...result.data.map(({ id }) => ({ type: "Stores", id })), { type: "Stores", id: "LIST" }]
            //         : [{ type: "Stores", id: "LIST" }],
        }),
 
        // GET /store/:id
        getStore: builder.query({
            query: (id) => ({ url: `/api/v1/stores/store/${id}`, skipToast: true }),
            providesTags: (_r, _e, id) => [{ type: "Stores", id }],
        }),
 
        // GET /store-deliveries/:id
        getStoreDeliveries: builder.query({
            query: (id) => ({ url: `/api/v1/stores/store-deliveries/${id}`, skipToast: true }),
            providesTags: (_r, _e, id) => [{ type: "StoreDeliveries", id }],
        }),
 
        // POST /stores
        addStore: builder.mutation({
            query: (body) => ({ url: "/api/v1/stores/stores", method: "POST", body }),
            invalidatesTags: [{ type: "Stores", id: "LIST" }],
        }),
 
        // PUT /store/:id
        updateStore: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/api/v1/stores/store/${id}`, method: "PUT", body }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "Stores", id }, { type: "Stores", id: "LIST" }],
        }),
 
        // DELETE /store/:id
        deleteStore: builder.mutation({
            query: (id) => ({ url: `/api/v1/stores/store/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "Stores", id: "LIST" }],
        }),
    }),
})
 
export const {
    useGetAllStoresQuery,
    useGetStoreQuery,
    useGetStoreDeliveriesQuery,
    useAddStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
} = storeApi
