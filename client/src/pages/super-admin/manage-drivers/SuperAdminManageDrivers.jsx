import AdminSubHeader from "@/components/AdminSubHeader"
import DriversFilter from "@/components/manage-driver/DriversFilter"
import DriversTable from "@/components/manage-driver/DriversTable"
import ManageDriverForm from "@/components/manage-driver/ManageDriverForm"

export default function SuperAdminManageDrivers() {
    return (
        <section className="mb-10">
            <AdminSubHeader
                to="/admin"
                heading="Manage Drivers"
                subh="Manage drivers — view, edit, trip status, details, history, and deactivate"
            />
            <DriversFilter CreateButton={<ManageDriverForm />}/>
            <DriversTable />
        </section>
    )
}