import AdminSubHeader from "@/components/AdminSubHeader";
import { selectUser } from "@/lib/features/auth/authSlice";
import { useGetReportsQuery } from "@/lib/features/reports/reportApi";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import ReportsFilter from "@/components/reports/ReportsFilter";
import ReportTable from "@/components/reports/ReportTable";
import ReportDetailsDrawer from "@/components/reports/ReportDetailsDrawer";

const LIMIT = 10;

export default function SuperAdminReports() {
    const { user } = useSelector(selectUser);
    const isadmin = user.role === 'super_admin'
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);
    const [viewReport, setViewReport] = useState(null)
    const [viewOpen, setViewOpen] = useState(false)

    const issueTypeFilter = useMemo(
        () => columnFilters.find(f => f.id === "issue_type")?.value || "",
        [columnFilters]
    )
    const reportedByFilter = useMemo(
        () => columnFilters.find(f => f.id === "is_complaintby_driver")?.value || "",
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

    const { data: reportsData, isLoading, isFetching } = useGetReportsQuery(
        { page, limit: LIMIT, search: debouncedSearch, issue_type: issueTypeFilter, reported_by: reportedByFilter }
    )

    
    
    const reports = useMemo(() => reportsData?.data || [], [reportsData])
    const totalPages = useMemo(() => reportsData?.pagination?.total_pages || 1, [reportsData])
    const currentPage = useMemo(() => reportsData?.pagination?.page || 1, [reportsData])
    console.log("reports", reports);


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
                heading="Reported Issues"
                subh="All reported delivery issues across brands — delays, vehicle breakdowns, location mismatches, communication failures, and package concerns"

            />

            <ReportDetailsDrawer
                report={viewReport}
                open={viewOpen}
                onClose={() => setViewOpen(false)}
            />

            <ReportsFilter
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleClear={handleClear}
            />

            <ReportTable
                reports={reports}
                setViewReport={setViewReport}
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