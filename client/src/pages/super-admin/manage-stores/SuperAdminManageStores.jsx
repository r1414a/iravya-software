// SuperAdminManageStores.jsx (Optimized)
import { useEffect, useState, useMemo } from "react"
import AdminSubHeader from "@/components/AdminSubHeader"
import StoreDetailDrawer from "@/components/manage-store/StoreDetailsDrawer"
import StoreForm from "@/components/manage-store/StoreForm"
import StoresFilter from "@/components/manage-store/StoresFilter"
import StoresTable from "@/components/manage-store/StoresTable"
import { useGetAllBrandsQuery } from "@/lib/features/brands/brandApi"
import { useGetAllStoresQuery } from "@/lib/features/stores/storeApi"
import { useGetAvailableManagersQuery } from "@/lib/features/users/userApi"
import { useSelector } from "react-redux"
import { selectUser } from "@/lib/features/auth/authSlice"

const LIMIT = 10

export default function SuperAdminManageStores() {

    const {user} = useSelector(selectUser);
    const isadmin = user.role === 'super_admin'
    // State
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [columnFilters, setColumnFilters] = useState([])
    const [managerSearch, setManagerSearch] = useState("")
    const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("")
    
    // Modal states
    const [editStore, setEditStore] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [viewStore, setViewStore] = useState(null)
    const [viewOpen, setViewOpen] = useState(false)

    // Extract filters
    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "status")?.value || "",
        [columnFilters]
    )
    const cityFilter = useMemo(
        () => columnFilters.find(f => f.id === "city")?.value || "",
        [columnFilters]
    )
    const brandFilter = useMemo(
        () => columnFilters.find(f => f.id === "brand_name")?.value || "",
        [columnFilters]
    )

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput)
            setPage(1)
        }, 500)
        return () => clearTimeout(handler)
    }, [searchInput])

    // Debounce manager search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedManagerSearch(managerSearch)
        }, 500)
        return () => clearTimeout(handler)
    }, [managerSearch])

    // API Queries
    const { data: storesData, isLoading, isFetching } = useGetAllStoresQuery({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        status: statusFilter,
        city: cityFilter,
        brand_id: brandFilter
    })

    const { data: managersData, isLoading: loadingManagers } = useGetAvailableManagersQuery({
        page: 1,
        limit: 10,
        search: debouncedManagerSearch,
    })

    const { data: brandsData } = useGetAllBrandsQuery()

    // Extract data
    const stores = useMemo(() => storesData?.data?.data || [], [storesData])
    const totalPages = useMemo(() => storesData?.data?.total_pages || 1, [storesData])
    const currentPage = useMemo(() => storesData?.data?.page || 1, [storesData])
    const managers = useMemo(() => managersData?.data?.users || [], [managersData])
    const brands = useMemo(() => brandsData?.data || [], [brandsData])

    // Handlers
    const handleClear = () => {
        setSearchInput("")
        setDebouncedSearch("")
        setPage(1)
    }

    const handlePrevious = () => setPage(prev => Math.max(prev - 1, 1))
    const handleNext = () => setPage(prev => prev < totalPages ? prev + 1 : prev)

    return (
        <section className="mb-10">
            <AdminSubHeader
                to={isadmin ? "/admin": "/dc"}
                heading="Manage Stores"
                subh={isadmin ? "All retail stores across all brands — add, edit, manage geofence and public tracking" : "Stores this DC delivers to — track incoming deliveries, devices held and manager contacts"}
            />

            <StoreForm
                store={editStore}
                brands={brands}
                managers={managers}
                managerSearch={managerSearch}
                loadingManagers={loadingManagers}
                setManagerSearch={setManagerSearch}
                open={editOpen}
                onClose={setEditOpen}
            />

            <StoreDetailDrawer
                store={viewStore}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />

            <StoresFilter
                setEditStore={setEditStore}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            />

            <StoresTable
                stores={stores}
                brands={brands}
                setEditStore={setEditStore}
                setEditOpen={setEditOpen}
                setViewStore={setViewStore}
                setViewOpen={setViewOpen}
                setPage={setPage}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                totalPages={totalPages}
                page={currentPage}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isFetching={isFetching || isLoading}
            />
        </section>
    )
}