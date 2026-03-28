import AdminSubHeader from "@/components/AdminSubHeader"
import TripsFilter from "@/components/manage-trip/TripsFilter"
import TripsTable from "@/components/manage-trip/TripsTable"

export default function SuperAdminManageTrips() {
    return (
        <section>

            <AdminSubHeader
                to="/admin"
                heading="Manage Trips"
                subh="Plan, track, and dispatch deliveries across all stores — select trucks, and schedule departures."
                CreateButton={null}
            />

            <TripsFilter />
            <TripsTable />

        </section>
    )
}