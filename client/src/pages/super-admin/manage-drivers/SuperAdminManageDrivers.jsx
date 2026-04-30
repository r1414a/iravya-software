import AdminSubHeader from "@/components/AdminSubHeader"
import CommonFilter from "@/components/CommonFilter"
import TripHistorySheet from "@/components/manage-driver/drivers-table/TripHistorySheet"
// import DriversFilter from "@/components/manage-driver/DriversFilter"
import DriversTable from "@/components/manage-driver/DriversTable"
import ManageDriverForm from "@/components/manage-driver/ManageDriverForm"
import TripDetailSheet from "@/components/manage-trip/TripDetailSheet"
import { selectUser } from "@/lib/features/auth/authSlice"
import { useSearchDriversQuery } from "@/lib/features/drivers/driverApi"
import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"

const LIMIT = 10

export default function SuperAdminManageDrivers() {

    const {user} = useSelector(selectUser);
     const isadmin = user.role === 'super_admin'
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    // Modal states
    const [editDriver, setEditDriver] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [driverHistory, setDriverHistory] = useState(null)
    const [driverHistoryOpen, setDriverHistoryOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null)
    const [currentTripOpen, setCurrentTripOpen] = useState(false)


    // Extract filters
    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "driver_status")?.value || "",
        [columnFilters]
    )
    const licenceFilter = useMemo(
        () => columnFilters.find(f => f.id === "licence_class")?.value || "",
        [columnFilters]
    )

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    const { data: driverData, isLoading, isFetching } = useSearchDriversQuery(
        { page, limit: LIMIT, search: debouncedSearch, status: statusFilter, licence_class: licenceFilter }
    )


    const drivers = useMemo(() => driverData?.data?.data || [], [driverData])
    const totalPages = useMemo(() => driverData?.data?.pagination?.total_pages || 1, [driverData])
    const currentPage = useMemo(() => driverData?.data?.pagination?.page || 1, [driverData])

    // const drivers = data?.data?.data || [];
    // const totalPages = data?.data?.pagination?.totalPages || 1;
    // const currentPage = data?.data?.pagination?.page || 1;

    const handleClear = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    };

    const handlePrevious = () => setPage(prev => Math.max(prev - 1, 1))
    const handleNext = () => setPage(prev => prev < totalPages ? prev + 1 : prev)

    return (
        <section className="mb-10">
            <AdminSubHeader
                to={isadmin? '/admin': '/dc'}
                heading="Manage Drivers"
                subh={isadmin ? "Manage drivers — view, edit, trip status, details, history, and deactivate" : "Manage drivers at this DC — add, edit, trip status, details, history."}
            />

            <ManageDriverForm
                driver={editDriver}
                open={editOpen}
                onClose={setEditOpen}
            />

            <TripDetailSheet
                entity={currentTrip}
                type="driver"
                open={currentTripOpen}
                onClose={() => setCurrentTripOpen(false)}
            />

            <TripHistorySheet
                driver={driverHistory}
                open={driverHistoryOpen}
                onClose={() => setDriverHistoryOpen(false)}
            />

            <CommonFilter
                setEditWho={setEditDriver}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
                buttonText={'Add Driver'}
                placeholder={"Search drivers by name or mobile number..."}
            />

            {/* <DriversFilter
                setEditDriver={setEditDriver}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            /> */}
            <DriversTable
                drivers={drivers}
                setEditDriver={setEditDriver}
                setEditOpen={setEditOpen}
                setDriverHistory={setDriverHistory}
                setDriverHistoryOpen={setDriverHistoryOpen}
                setCurrentTrip={setCurrentTrip}
                setCurrentTripOpen={setCurrentTripOpen}
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