
import CreateNewTrip from "./CreateNewTrip"
import TripsFilter from "./TripsFilter"
import TripsTable from "./TripsTable"
import AdminSubHeader from "@/components/AdminSubHeader"

export default function DCManageTrips() {
    return (
        <section>

            <AdminSubHeader
                to="/dc"
                heading="Manage Trips"
                subh="Plan, track, and dispatch deliveries across all stores — select trucks, and schedule departures."
                CreateButton={<CreateNewTrip />}
            />

            <TripsFilter />
            <TripsTable />

        </section>
    )
}