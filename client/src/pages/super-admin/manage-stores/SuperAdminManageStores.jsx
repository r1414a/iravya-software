import AdminSubHeader from "@/components/AdminSubHeader"
import StoreForm from "@/components/manage-store/StoreForm"
import StoresFilter from "@/components/manage-store/StoresFilter"
import StoresTable from "@/components/manage-store/StoresTable"
import { useGetAllBrandsQuery } from "@/lib/features/brands/brandApi"
import { useGetAllStoresQuery } from "@/lib/features/stores/storeApi"
import { useGetAvailableManagersQuery } from "@/lib/features/users/userApi"
import { useEffect, useState } from "react"

const limit = 10;

export default function SuperAdminManageStores() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);
    const [managerSearch, setManagerSearch] = useState("");
    const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("");
    const [editStore, setEditStore] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

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

     useEffect(() => {
            const t = setTimeout(() => {
                setDebouncedManagerSearch(managerSearch);
            }, 500);
    
            return () => clearTimeout(t);
        }, [managerSearch]);

    const { data, isLoading, isFetching } = useGetAllStoresQuery(
        { page, limit, search: debouncedSearch, status: statusFilter, city: cityFilter, brand_id: brandFilter }
    )

    const { data: managersData, isLoading: loadingManagers } = useGetAvailableManagersQuery({
            page: 1,
            limit: 10,
            search: debouncedManagerSearch,
        });
        const managers = managersData?.data?.users || [];

    const { data: brandsData } = useGetAllBrandsQuery();
    const brands = brandsData?.data || [];
    
    const stores = data?.data?.data || [];
    const totalPages = data?.data?.total_pages || 1;
    const currentPage = data?.data?.page || 1;

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

            <StoreForm
                store={editStore}
                brands={brands}
                managers={managers}
                managerSearch={managerSearch}
                loadingManagers={loadingManagers} 
                setManagerSearch={setManagerSearch}
                open={editOpen}
                onClose={setEditOpen}
            />


            <StoresFilter
            setEditStore={setEditStore}
                setEditOpen={setEditOpen}
                // CreateButton={() => <StoreForm mode="add" brands={brands} />}
                searchInput={searchInput}
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }}
                handleClear={handleClear}
            />
            <StoresTable
                stores={stores}
                setEditStore={setEditStore}
                setEditOpen={setEditOpen}
                setPage={setPage}
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