// SuperAdminManageDCs.jsx (Optimized)
import { useEffect, useState, useMemo, useCallback } from "react"
import AdminSubHeader from "@/components/AdminSubHeader"
import AddDCForm from "@/components/super-admin/manage-dcs/AddDcForm"
import DCsFilter from "@/components/super-admin/manage-dcs/DcsFilter"
import DCsTable from "@/components/super-admin/manage-dcs/DcsTable"
import { useGetAllDcsQuery } from "@/lib/features/dcs/dcApi"
import { useGetAvailableManagersQuery } from "@/lib/features/users/userApi"
import DCDetailDrawer from "@/components/super-admin/manage-dcs/DcDetailDrawer"

const LIMIT = 10

export default function SuperAdminManageDCs() {
    // State
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [columnFilters, setColumnFilters] = useState([])
    const [managerSearch, setManagerSearch] = useState("")
    const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("")

    // Modal states
    const [editDc, setEditDc] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [viewDc, setViewDc] = useState(null)
        const [viewOpen, setViewOpen] = useState(false)

    // Extract status filter
    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "status")?.value || "",
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
    const { data: dcsData, isLoading, isFetching } = useGetAllDcsQuery({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        dc_status: statusFilter
    })

    const { data: managersData, isLoading: loadingManagers } = useGetAvailableManagersQuery({
        page: 1,
        limit: 10,
        search: debouncedManagerSearch,
    })

    // Extract data
    const dcs = useMemo(() => dcsData?.data?.data || [], [dcsData])
    const totalPages = useMemo(() => dcsData?.data?.pagination?.totalPages || 1, [dcsData])
    const currentPage = useMemo(() => dcsData?.data?.pagination?.page || 1, [dcsData])
    const managers = useMemo(() => managersData?.data?.users || [], [managersData])

    // Handlers
    const handleClear = useCallback(() => {
        setSearchInput("")
        setDebouncedSearch("")
        setPage(1)
    }, [])

    const handlePrevious = useCallback(() => {
        setPage(prev => Math.max(prev - 1, 1))
    }, [])

    const handleNext = useCallback(() => {
        setPage(prev => prev < totalPages ? prev + 1 : prev)
    }, [totalPages])

    const handleSearchChange = useCallback((val) => {
        setSearchInput(val)
        setPage(1)
    }, [])

    return (
        <section className="mb-10">
            <AdminSubHeader
                to="/admin"
                heading="Manage DCs"
                subh="All data centers across all brands — add, edit, assign operators and manage trucks"
            />

            <AddDCForm
                dc={editDc}
                managers={managers}
                managerSearch={managerSearch}
                loadingManagers={loadingManagers}
                setManagerSearch={setManagerSearch}
                open={editOpen}
                onClose={setEditOpen}
            />

            <DCDetailDrawer
                dc={viewDc}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />

            <DCsFilter
                setEditDc={setEditDc}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={handleSearchChange}
                handleClear={handleClear}
            />

            <DCsTable
                dcs={dcs}
                setEditDc={setEditDc}
                setEditOpen={setEditOpen}
                setViewDc={setViewDc}
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