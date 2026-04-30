// import UsersFilter from "./UsersFilter"
import UsersTable from "./UsersTable"
import AdminSubHeader from "@/components/AdminSubHeader"
import CreateUserModal from "./CreateUserModal"
import { useState, useEffect } from "react"
import { useGetAllUsersQuery } from "@/lib/features/users/userApi"
import CommonFilter from "@/components/CommonFilter"


const LIMIT = 10

export default function SuperAdminManageUser() {
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState([]);


    // Modal states
    const [editUser, setEditUser] = useState(null)
    const [editOpen, setEditOpen] = useState(false)

    const statusFilter = useMemo(
        () => columnFilters.find(f => f.id === "user_status")?.value || "",
        [columnFilters]
    )

    const roleFilter = useMemo(
        () => columnFilters.find(f => f.id === "role")?.value || "",
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

    const { data: usersData, isLoading, isFetching } = useGetAllUsersQuery({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter
    });


    // Extract data
    const users = useMemo(() => usersData?.data?.users || [], [usersData])
    const totalPages = useMemo(() => usersData?.data?.totalPages || 1, [usersData])
    const currentPage = useMemo(() => usersData?.data?.page || 1, [usersData])

    const handleClear = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setPage(1);
    };

    const handlePrevious = useCallback(() => {
        setPage(prev => Math.max(prev - 1, 1))
    }, [])

    const handleNext = useCallback(() => {
        setPage(prev => prev < totalPages ? prev + 1 : prev)
    }, [totalPages])

    const handleSearchChange = useCallback((val) => {
        setSearchInput(val)
        setPage(1)
    }, [])
    return (
        <section className="mb-10">
            <AdminSubHeader
                to={'/admin'}
                heading="Manage Users"
                subh="Manage users across all brands — invite, edit roles, deactivate and reset passwords"
            />

            <CreateUserModal
                user={editUser}
                open={editOpen}
                onClose={setEditOpen}
            />

            <CommonFilter
                setEditWho={setEditUser}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={handleSearchChange}
                handleClear={handleClear}
                buttonText={'Add User'}
                placeholder={'"Search user by name/email..."'}
            />

            {/* <UsersFilter
                setEditUser={setEditUser}
                setEditOpen={setEditOpen}
                searchInput={searchInput}
                setSearchInput={handleSearchChange}
                handleClear={handleClear}
            /> */}
            <UsersTable
                users={users}
                setEditUser={setEditUser}
                setEditOpen={setEditOpen}
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
