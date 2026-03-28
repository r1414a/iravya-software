import AdminSubHeader from "@/components/AdminSubHeader"
import DriversFilter from "@/components/manage-driver/DriversFilter"
import DriversTable from "@/components/manage-driver/DriversTable"
import ManageDriverForm from "@/components/manage-driver/ManageDriverForm"

export default function DCManageDrivers() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="Manage Drivers"
                subh="Manage drivers at this DC — add, edit, trip status, details, history, and deactivate"
                CreateButton={<ManageDriverForm />}
            />
            {/* <div className="h-18 px-10 flex gap-4 items-center shadow-md">
                <Link to={'/dc'} className="bg-gold hover:bg-gold-dark p-2 rounded-full">
                    <ArrowLeft size={18} className="text-maroon" />
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="-space-y-1">
                        <h1 className="text-lg">Manage Drivers</h1>
                        <p className="text-sm text-gray-500">
                            Manage drivers at this DC — add, edit, assign to trucks, and deactivate
                        </p>
                    </div>
                    <ManageDriverForm />
                </div>
            </div> */}
 
            <DriversFilter />
            <DriversTable />
        </section>
    )
}