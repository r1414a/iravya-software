import AdminSubHeader from "@/components/AdminSubHeader"
import AddTruckForm from "@/components/manage-truck/AddTruckForm"
import TrucksFilter from "@/components/manage-truck/TrucksFilter"
import TrucksTable from "@/components/manage-truck/TrucksTable"

export default function DCManageTrucks() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="Trucks at this DC"
                subh="All trucks assigned to Pune Warehouse — view status, trip status, details, history, dispatch idle trucks"
                CreateButton={<AddTruckForm />}
            />


            <TrucksFilter />
            <TrucksTable />
        </section>
    )
}