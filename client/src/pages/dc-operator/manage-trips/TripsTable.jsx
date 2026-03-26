import { DataTable } from "./trips-table/data-table"
import { columns } from "./trips-table/columns"

const trips = [
    {
        id: "TRP-2841",
        brand: "Tata Westside",
        truck: "MH12AB1234",
        driver: "Ramesh K.",
        sourceDC: "Pune Warehouse DC",
        stops: ["Koregaon Park Store", "Baner Store"],
        stopsCount: 2,
        status: "in_transit",
        departedAt: "Today, 09:30 AM",
        eta: "Today, 11:45 AM",
        completedAt: null,
    },
    {
        id: "TRP-2840",
        brand: "Zudio",
        truck: "MH14CD5678",
        driver: "Suresh M.",
        sourceDC: "Mumbai Warehouse DC",
        stops: ["Hinjawadi Store"],
        stopsCount: 1,
        status: "in_transit",
        departedAt: "Today, 08:15 AM",
        eta: "Today, 10:30 AM",
        completedAt: null,
    },
    {
        id: "TRP-2839",
        brand: "Tata Cliq",
        truck: "MH04EF9012",
        driver: "Vijay P.",
        sourceDC: "Nashik DC",
        stops: ["FC Road Store", "Kothrud Store", "Baner Store"],
        stopsCount: 3,
        status: "completed",
        departedAt: "Yesterday, 07:00 AM",
        eta: null,
        completedAt: "Yesterday, 12:30 PM",
    },
    {
        id: "TRP-2838",
        brand: "Tanishq",
        truck: "MH12GH3456",
        driver: "Ankit S.",
        sourceDC: "Pune Warehouse DC",
        stops: ["Hinjawadi Store"],
        stopsCount: 1,
        status: "completed",
        departedAt: "Yesterday, 09:00 AM",
        eta: null,
        completedAt: "Yesterday, 11:15 AM",
    },
    {
        id: "TRP-2837",
        brand: "Tata Westside",
        truck: "MH20IJ7890",
        driver: "Kiran S.",
        sourceDC: "Pune Warehouse DC",
        stops: ["Koregaon Park Store"],
        stopsCount: 1,
        status: "scheduled",
        departedAt: null,
        eta: "Today, 02:00 PM",
        completedAt: null,
    },
    {
        id: "TRP-2836",
        brand: "Zudio",
        truck: "MH15KL2345",
        driver: "Meera A.",
        sourceDC: "Mumbai Warehouse DC",
        stops: ["FC Road Store", "Baner Store"],
        stopsCount: 2,
        status: "cancelled",
        departedAt: null,
        eta: null,
        completedAt: null,
    },
]

export default function TripsTable() {
    return (
        <section className="mt-6 px-10">
            <div className="border rounded-lg">
                <DataTable columns={columns} data={trips} />
            </div>
        </section>
    )
}