// import { ArrowLeft } from "lucide-react"
// import { Link } from "react-router-dom"
import AdminSubHeader from "@/components/AdminSubHeader"
import AddDCForm from "@/components/super-admin/manage-dcs/AddDcForm"
import DCsFilter from "@/components/super-admin/manage-dcs/DcsFilter"
import DCsTable from "@/components/super-admin/manage-dcs/DcsTable"
AdminSubHeader

export default function SuperAdminManageDCs() {
    return (
        <section>

            <AdminSubHeader
                to={'/admin'}
                heading="Manage Warehouses"
                subh="All data centers across all brands — add, edit, assign operators and manage trucks"
                CreateButton={<AddDCForm />}
            />
            {/* <div className="h-18 px-10 flex gap-4 items-center shadow-md">
                <Link to={'/admin'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage Warehouses</h1>
                        <p className="text-sm text-gray-500">
                            All data centers across all brands — add, edit, assign operators and manage trucks
                        </p>
                    </div>
                    <AddDCForm />
                </div>
            </div> */}

            <DCsFilter />
            <DCsTable />
        </section>
    )
}