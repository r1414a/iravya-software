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
            />
            <DriversFilter CreateButton={null}/>
            <DriversTable />
        </section>
    )
}