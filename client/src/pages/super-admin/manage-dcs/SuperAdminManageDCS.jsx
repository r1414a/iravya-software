import AdminSubHeader from "@/components/AdminSubHeader"
import AddDCForm from "@/components/super-admin/manage-dcs/AddDcForm"
import DCsFilter from "@/components/super-admin/manage-dcs/DcsFilter"
import DCsTable from "@/components/super-admin/manage-dcs/DcsTable"
import { useGetAllDcsQuery } from "@/lib/features/dcs/dcApi"
import { useGetAvailableManagersQuery } from "@/lib/features/users/userApi"
import { useState, useEffect } from "react"

const limit = 10;

export default function SuperAdminManageDCs() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);
    // const [managerSearch, setManagerSearch] = useState("");
    // // const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("");
    const [editDc, setEditDc] = useState(null);
    const [editOpen, setEditOpen] = useState(false);


    const statusFilter = columnFilters.find(f => f.id === "status")?.value || "";


    // Handle debouncing manually
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // Reset to page 1 whenever the search term actually changes
        }, 500);

        return () => clearTimeout(handler); // Cleanup on every keystroke
    }, [searchInput]);

    // useEffect(() => {
    //     const t = setTimeout(() => {
    //         setDebouncedManagerSearch(managerSearch);
    //     }, 500);

    //     return () => clearTimeout(t);
    // }, [managerSearch]);

    const { data, isLoading, isFetching } = useGetAllDcsQuery(
        { page, limit, search: debouncedSearch, dc_status: statusFilter }
    )
    // const { data: managersData, isLoading: loadingManagers } = useGetAvailableManagersQuery({
    //     page: 1,
    //     limit: 10,
    //     search: debouncedManagerSearch,
    // });
    // const { data: managersData, isLoading: loadingManagers } = useGetAvailableManagersQuery();
    // const managers = managersData?.data?.users || [];

    const dcs = data?.data?.data || [];
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
                heading="Manage Dc's"
                subh="All data centers across all brands — add, edit, assign operators and manage trucks"

            />


            <AddDCForm
                dc={editDc}
                // managers={managers}
                open={editOpen}
                onClose={setEditOpen}
                hideTrigger
            />

            <DCsFilter
                setEditDc={setEditDc}
                setEditOpen={setEditOpen}
                // CreateButton={<AddDCForm
                    // managers={managers}
                // loadingManagers={loadingManagers}
                // managerSearch={managerSearch}
                // setManagerSearch={setManagerSearch}
                // />}
                searchInput={searchInput}
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }}
                handleClear={handleClear}
            />
            <DCsTable
                dcs={dcs}
                // managers={managers}
                setEditDc={setEditDc}
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