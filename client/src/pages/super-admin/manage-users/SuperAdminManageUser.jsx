import UsersFilter from "./UsersFilter"
import UsersTable from "./UsersTable"
import AdminSubHeader from "@/components/AdminSubHeader"
import CreateUserModal from "./CreateUserModal"
import { useState, useEffect } from "react"
import { useGetAllUsersQuery } from "@/lib/features/users/userApi"


const limit = 10;

export default function SuperAdminManageUser() {
    const [page, setPage] = useState(1);
        const [searchInput, setSearchInput] = useState("")
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [columnFilters, setColumnFilters] = useState([]);

        const statusFilter = columnFilters.find(f => f.id === "user_status")?.value || "";
        const roleFilter = columnFilters.find(f => f.id === "role")?.value || "";

         // Handle debouncing manually
            useEffect(() => {
                const handler = setTimeout(() => {
                    setDebouncedSearch(searchInput);
                    setPage(1); // Reset to page 1 whenever the search term actually changes
                }, 500);
        
                return () => clearTimeout(handler); // Cleanup on every keystroke
            }, [searchInput]);

    const {data, isLoading, isFetching} = useGetAllUsersQuery({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter
    });


    const users = data?.data?.users || [];
    console.log("all users", users);
    
    const totalPages = data?.data?.totalPages || 1;
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
                heading="Manage Users"
                subh="Manage users across all brands — invite, edit roles, deactivate and reset passwords"
            />
           

            <UsersFilter 
                CreateButton={<CreateUserModal />}
                 searchInput={searchInput}
                setSearchInput={(val) => {
                    setSearchInput(val);
                    setPage(1); // Reset page when typing
                }}
                handleClear={handleClear}    
            />
            <UsersTable
                users={users}
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