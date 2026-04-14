import AdminSubHeader from "@/components/AdminSubHeader"
import DriversFilter from "@/components/manage-driver/DriversFilter"
import DriversTable from "@/components/manage-driver/DriversTable"
import ManageDriverForm from "@/components/manage-driver/ManageDriverForm"
import { useGetAllDriversQuery, useSearchDriversQuery } from "@/lib/features/drivers/driverApi"
import { useState, useEffect } from "react"

const limit = 10;

export default function SuperAdminManageDrivers() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

     const statusFilter = columnFilters.find(f => f.id === "status")?.value || "";
     const licenceFilter = columnFilters.find(f => f.id === "licence_class")?.value || "";

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    const { data, isLoading, isFetching } = useSearchDriversQuery(
        { page, limit, search: debouncedSearch }
    )


    const drivers = data?.data?.data || [];
    const totalPages = data?.data?.pagination?.totalPages || 1;
    const currentPage = data?.data?.pagination?.page || 1;

    const handleClear = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    };

    return (
        <section className="mb-10">
            <AdminSubHeader
                to="/admin"
                heading="Manage Drivers"
                subh="Manage drivers — view, edit, trip status, details, history, and deactivate"
            />
            <DriversFilter
                CreateButton={<ManageDriverForm />}
                searchInput={searchInput}
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }}
                handleClear={handleClear}
            />
            <DriversTable
                drivers={drivers}
                totalPages={totalPages}
                page={currentPage}
                onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
                onNext={() => setPage((prev) => prev < (totalPages || 1) ? prev + 1 : prev)}
                isFetching={isFetching || isLoading}
            />
        </section>
    )
}