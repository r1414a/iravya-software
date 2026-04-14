import AdminSubHeader from "@/components/AdminSubHeader"
import StoreForm from "@/components/manage-store/StoreForm"
import StoresFilter from "@/components/manage-store/StoresFilter"
import StoresTable from "@/components/manage-store/StoresTable"
import { useGetAllBrandsQuery } from "@/lib/features/brands/brandApi"
import { useGetAllStoresQuery } from "@/lib/features/stores/storeApi"
import { useEffect, useState } from "react"

const limit = 10;

export default function SuperAdminManageStores() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);

    const statusFilter = columnFilters.find(f => f.id === "status")?.value || "";
    const cityFilter = columnFilters.find(f => f.id === "city")?.value || "";
    const brandFilter = columnFilters.find(f => f.id === "brand_name")?.value || "";

    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    const { data, isLoading, isFetching } = useGetAllStoresQuery(
        { page, limit, search: debouncedSearch, status: statusFilter, city: cityFilter, brand_id: brandFilter }
    )
    const { data: brandsData } = useGetAllBrandsQuery();
const brands = brandsData?.data || [];
console.log("super admin parent", brands);



    const stores = data?.data?.data || [];
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
                to={'/admin'}
                heading="Manage Stores"
                subh="All retail stores across all brands — add, edit, manage geofence and public tracking"
            />


            <StoresFilter 
            CreateButton={() => <StoreForm mode="add" brands={brands}/>} 
            searchInput={searchInput}
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }}
                handleClear={handleClear}
            />
            <StoresTable 
            stores={stores}
                setPage={setPage}
                brands={brands}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                totalPages={totalPages}
                page={currentPage}
                onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
                onNext={() => setPage((prev) => prev < (totalPages || 1) ? prev + 1 : prev)}
                isFetching={isFetching || isLoading}
            />
        </section>
    )
}