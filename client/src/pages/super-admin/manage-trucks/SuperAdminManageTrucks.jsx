
import AdminSubHeader from "@/components/AdminSubHeader"
import CreateTripModal from "@/components/manage-trip/CreateNewTrip";
import TripDetailSheet from "@/components/manage-trip/TripDetailSheet";
import AddTruckModal from "@/components/manage-truck/AddTruckForm";
import AddTruckForm from "@/components/manage-truck/AddTruckForm"
import TruckDetailDrawer from "@/components/manage-truck/TruckDetailDrawer";
import TrucksFilter from "@/components/manage-truck/TrucksFilter"
import TrucksTable from "@/components/manage-truck/TrucksTable"
import { selectUser } from "@/lib/features/auth/authSlice";
import { useGetAllTrucksQuery, useGetTruckRecentTripQuery } from "@/lib/features/trucks/truckApi";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";

const LIMIT = 10

export default function SuperAdminManageTrucks() {
    const {user} = useSelector(selectUser);
    const isadmin = user.role === 'super_admin'
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    // Modal states
    const [editTruck, setEditTruck] = useState(null)
    const [editOpen, setEditOpen] = useState(false);
    const [truckHistory, setTruckHistory] = useState(null)
    const [truckHistoryOpen, setTruckHistoryOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null)
    const [currentTripOpen, setCurrentTripOpen] = useState(false);
    const [dispatchTruck, setDispatchTruck] = useState(null);
    const [dispatchTruckOpen, setDispatchTruckOpen] = useState(false);


    // Extract filters
    const typeFilter = useMemo(
        () => columnFilters.find(f => f.id === "type")?.value || "",
        [columnFilters]
    )
    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "status")?.value || "",
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

    const { data: truckData, isLoading, isFetching } = useGetAllTrucksQuery(
        { page, limit: LIMIT, search: debouncedSearch, type: typeFilter, status: statusFilter }
    )

    const trucks = useMemo(() => truckData?.data?.data || [], [truckData])
    const totalPages = useMemo(() => truckData?.data?.pagination?.totalPages || 1, [truckData])
    const currentPage = useMemo(() => truckData?.data?.pagination?.page || 1, [truckData])


    // const trucks = data?.data?.data || [];
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
                heading="Manage Trucks"
                subh={isadmin ? "All trucks — view status, trip status, details, history"
                : "Manage trucks at this DC — view status, trip status, details, history, dispatch idle trucks "}
            />


            {/* dispatch trip for dc */}
            <CreateTripModal
                truck={dispatchTruck}
                open={dispatchTruckOpen}
                onClose={() => setDispatchTruckOpen(false)}
            />

            {/* add a truck */}
            <AddTruckModal
                truck={editTruck}
                open={editOpen}
                onClose={setEditOpen}
            />

            {/* truck past trip/history */}
            <TruckDetailDrawer
                truck={truckHistory}
                open={truckHistoryOpen}
                onClose={() => setTruckHistoryOpen(false)}
            />

            {/* truck who are in transit/on trip details */}
            <TripDetailSheet
                entity={currentTrip}
                type="truck"
                open={currentTripOpen}
                onClose={() => setCurrentTripOpen(false)}
            />

            <TrucksFilter
                setEditTruck={setEditTruck}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            />


            <TrucksTable
                trucks={trucks}
                setEditTruck={setEditTruck}
                setEditOpen={setEditOpen}
                setTruckHistory={setTruckHistory}
                setTruckHistoryOpen={setTruckHistoryOpen}
                setCurrentTrip={setCurrentTrip}
                setCurrentTripOpen={setCurrentTripOpen}
                setDispatchTruck={setDispatchTruck}
                setDispatchTruckOpen={setDispatchTruckOpen}
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