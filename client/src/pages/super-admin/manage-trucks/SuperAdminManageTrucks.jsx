
import AdminSubHeader from "@/components/AdminSubHeader"
import AddTruckForm from "@/components/manage-truck/AddTruckForm"
import TrucksFilter from "@/components/manage-truck/TrucksFilter"
import TrucksTable from "@/components/manage-truck/TrucksTable"
import { useGetAllTrucksQuery } from "@/lib/features/trucks/truckApi";
import { useEffect, useState } from "react";

const limit = 10;

export default function SuperAdminManageTrucks() {
     const [page, setPage] = useState(1);
        const [searchInput, setSearchInput]   = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [columnFilters, setColumnFilters] = useState([]);

    const typeFilter = columnFilters.find(f => f.id === "type")?.value || "";
    const statusFilter = columnFilters.find(f => f.id === "status")?.value || "";

    
        // Handle debouncing manually
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedSearch(searchInput);
                setPage(1); // Reset to page 1 whenever the search term actually changes
            }, 500);
    
            return () => clearTimeout(handler); // Cleanup on every keystroke
        }, [searchInput]);
    
        const { data, isLoading, isFetching } = useGetAllTrucksQuery(
            { type: typeFilter,status: statusFilter,page, limit, search: debouncedSearch}
        )
    
    
         const trucks = data?.data?.data || [];
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
                heading="Manage Trucks"
                subh="All trucks — view status, trip status, details, history"
            />


            <TrucksFilter 
                CreateButton={<AddTruckForm />}
                searchInput={searchInput} 
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }} 
                handleClear={handleClear}
            />
            <TrucksTable 
                trucks={trucks} 
                setPage={setPage}
                columnFilters={columnFilters} 
                setColumnFilters={setColumnFilters}
                totalPages={totalPages}
                page={currentPage}
                onPrevious={() => setPage((prev) => Math.max(prev-1,1))}
                onNext={() => setPage((prev) => prev < (totalPages || 1) ? prev + 1 : prev)}
                isFetching={isFetching || isLoading}
            />
        </section>
    )
}