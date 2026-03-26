import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import ManageUserForm from "./CreateUserModal"
import UsersFilter from "./UsersFilter"
import UsersTable from "./UsersTable"

export default function SuperAdminManageUser() {
    return (
        <section>
            <div className="h-18 px-10 flex gap-4 items-center shadow-md ">
                <Link to={'/admin'} className="bg-gray-100 p-2 rounded-full">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage Users</h1>
                        <p className="text-sm text-gray-500">Manage users across all brands — invite, edit roles, deactivate and reset passwords</p>
                    </div>
                    <ManageUserForm />
                </div>
            </div>

            <UsersFilter/>
            <UsersTable/>


        </section>
    )
}