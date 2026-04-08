import AdminSubHeader from "@/components/AdminSubHeader"
import DriversFilter from "@/components/manage-driver/DriversFilter"
import DriversTable from "@/components/manage-driver/DriversTable"
import ManageDriverForm from "@/components/manage-driver/ManageDriverForm"
import { useGetAllDriversQuery, useSearchDriversQuery } from "@/lib/features/drivers/driverApi"
import { useState, useEffect } from "react"

const limit = 10;

export default function SuperAdminManageDrivers() {
    const [page, setPage] = useState(1);
    // const [search, setSearch] = useState("");
    const [searchInput, setSearchInput]   = useState("")
const [debouncedSearch, setDebouncedSearch] = useState("");

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    // const isSearching = search.trim().length > 0;

    //  const { data: listData, isLoading: listLoading, isFetching: getFetching, isError, refetch } = useGetAllDriversQuery(
    //     { page, limit }
    // )

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

    // const activeData = isSearching ? searchData : listData;
    // const drivers       = activeData?.data?.data   || []
    // const pagination    = activeData?.data?.pagination || activeData?.data
    // const totalPages    = activeData?.data?.data?.totalPages   || 1
    // const isLoading     = isSearching ? searchLoading : listLoading
    

    // console.log(drivers,totalPages, activeData?.data?.page);
    
    // const handleSearch  = () => { setSearch(searchInput); setPage(1) }
    // const handleClear   = () => { setDebouncedSearch(""); setSearchInput(""); setPage(1) }

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
                onPrevious={() => setPage((prev) => Math.max(prev-1,1))}
                onNext={() => setPage((prev) => prev < (totalPages || 1) ? prev + 1 : prev)}
                isFetching={isFetching || isLoading}
            />
        </section>
    )
}