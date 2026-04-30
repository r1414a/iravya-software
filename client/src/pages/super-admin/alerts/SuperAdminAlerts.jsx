import AdminSubHeader from "@/components/AdminSubHeader"
import AlertsFilter from "@/components/alerts/AlertsFilter"
import AlertsTable from "@/components/alerts/AlertsTable"
import { useState, useEffect, useMemo } from "react";

const LIMIT = 10;

export default function SuperAdminAlerts() {

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    // Extract filters
    // const statusFilter = useMemo(
    //     () => columnFilters.find(f => f.id === "driver_status")?.value || "",
    //     [columnFilters]
    // )

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    // const { data: alertData, isLoading, isFetching } = useSearchDriversQuery(
    //         { page, limit: LIMIT, search: debouncedSearch, status: statusFilter }
    //     )


    // const alerts = useMemo(() => alertData?.data?.data || [], [alertData])
    // const totalPages = useMemo(() => alertData?.data?.pagination?.total_pages || 1, [alertData])
    // const currentPage = useMemo(() => alertData?.data?.pagination?.page || 1, [alertData])


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
                to={'/admin'}
                heading="Alerts"
                subh="All system alerts across every brand — speeding, long stops, route deviations and device issues"

            />

            <AlertsFilter
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            />

            <AlertsTable
                // alerts={alerts}
                setPage={setPage}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                // totalPages={totalPages}
                // page={currentPage}
                onPrevious={handlePrevious}
                onNext={handleNext}
            // isFetching={isFetching || isLoading}
            />
        </section>
    )
}