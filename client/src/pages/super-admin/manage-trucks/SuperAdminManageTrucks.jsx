
import AdminSubHeader from "@/components/AdminSubHeader"
import AddTruckForm from "@/components/manage-truck/AddTruckForm"
import TrucksFilter from "@/components/manage-truck/TrucksFilter"
import TrucksTable from "@/components/manage-truck/TrucksTable"


export default function SuperAdminManageTrucks() {
    return (
        <section>
            <AdminSubHeader
                to="/admin"
                heading="Manage Trucks"
                subh="All trucks — view status, trip status, details, history"
                CreateButton={null}
            />


            <TrucksFilter CreateButton={<AddTruckForm />}/>
            <TrucksTable />
        </section>
    )
}