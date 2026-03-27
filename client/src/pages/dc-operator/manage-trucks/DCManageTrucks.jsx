
import AddTruckForm from "./AddTruckForm"
import TrucksFilter from "./TrucksFilter"
import TrucksTable from "./TrucksTable"
import AdminSubHeader from "@/components/AdminSubHeader"

export default function DCManageTrucks() {
    return (
        <section>
            <AdminSubHeader
                to="/dc"
                heading="Trucks at this DC"
                subh="All trucks assigned to Pune Warehouse — view status, assign drivers, dispatch idle trucks"
                CreateButton={<AddTruckForm />}
            />


            <TrucksFilter />
            <TrucksTable />
        </section>
    )
}