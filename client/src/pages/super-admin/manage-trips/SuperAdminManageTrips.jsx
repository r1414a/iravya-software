import AdminSubHeader from "@/components/AdminSubHeader"
import CreateTripModal from "@/components/manage-trip/CreateNewTrip";
import TripDetailSheet from "@/components/manage-trip/TripDetailSheet";
import TripsFilter from "@/components/manage-trip/TripsFilter"
import TripsTable from "@/components/manage-trip/TripsTable"
import { selectUser } from "@/lib/features/auth/authSlice";
import { useGetAllTripsQuery } from "@/lib/features/trips/tripApi";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const LIMIT = 10;

export default function SuperAdminManageTrips() {
    const {user} = useSelector(selectUser)
    const isadmin = user.role === 'super_admin'
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);


    // Modal states
    const [editTrip, setEditTrip] = useState(null)
    const [editOpen, setEditOpen] = useState(false)
    const [tripDetail, setTripDetail] = useState(null)
    const [tripDetailOpen, setTripDetailOpen] = useState(false)

    // Extract filters
    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "status")?.value || "",
        [columnFilters])

    const dcFilter = useMemo(
        () => columnFilters.find(f => f.id === "source_dc_name")?.value || "",
        [columnFilters])

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);


    const { data: tripData, isLoading, isFetching } = useGetAllTripsQuery(
        { page, limit: LIMIT, search: debouncedSearch, status: statusFilter, city: dcFilter }
    )

    const trips = useMemo(() => tripData?.data?.data || [], [tripData])
    const totalPages = useMemo(() => tripData?.data?.pagination?.totalPages || 1, [tripData])
    const currentPage = useMemo(() => tripData?.data?.pagination?.page || 1, [tripData])

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
                to={isadmin ? "/admin": "/dc"}
                heading="Manage Trips"
                subh={isadmin ? "View and track deliveries across all stores" : "Plan, track, and dispatch deliveries across all stores — select trucks, and schedule departures."}
            />

            <CreateTripModal
                truck={editTrip}
                open={editOpen}
                onClose={setEditOpen}
            />

            <TripDetailSheet
                entity={tripDetail}
                type="trip"
                open={tripDetailOpen}
                onClose={() => setTripDetailOpen(false)}
            />

            <TripsFilter
                setEditTrip={setEditTrip}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            />
            <TripsTable
                trips={trips}
                setEditTrip={setEditTrip}
                setEditOpen={setEditOpen}
                setTripDetail={setTripDetail}
                setTripDetailOpen={setTripDetailOpen}
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