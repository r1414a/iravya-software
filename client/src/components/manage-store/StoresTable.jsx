import { DataTable } from "./store-table/data-table"
import { columns } from "./store-table/columns"

const stores = [
    {
        id: 1,
        name: "Westside — Koregaon Park",
        city: "Pune",
        address: "Shop 12, Phoenix Market City, Nagar Rd, Pune 411006",
        managerName: "Arjun Joshi",
        managerPhone: "+91 98201 44321",
        managerEmail: "arjun.j@westside.com",
        publicTrackingSlug: "westside-koregaon",
        deliveriesToday: 2,
        totalDeliveries: 184,
        currentDevices: ["GPS-003-PUNE"],
        lastDelivery: "Today, 10:45 AM",
        status: "active",
        createdAt: "Jan 2023",
    },
    {
        id: 2,
        name: "Zudio — Hinjawadi",
        city: "Pune",
        address: "G-14, Xion Mall, Hinjawadi Phase 1, Pune 411057",
        managerName: "Neha Patil",
        managerPhone: "+91 99705 12345",
        managerEmail: "neha.p@zudio.com",
        publicTrackingSlug: "zudio-hinjawadi",
        deliveriesToday: 1,
        totalDeliveries: 97,
        currentDevices: [],
        lastDelivery: "Today, 08:30 AM",
        status: "active",
        createdAt: "Mar 2023",
    },
    {
        id: 3,
        name: "Tata Cliq — FC Road",
        city: "Pune",
        address: "1st Floor, Westend Mall, FC Road, Pune 411004",
        managerName: "Sunita Mehta",
        managerPhone: "+91 91305 67890",
        managerEmail: "sunita.m@tatacliq.com",
        publicTrackingSlug: "tatacliq-fcroad",
        deliveriesToday: 0,
        totalDeliveries: 122,
        currentDevices: ["GPS-007-PUNE"],
        lastDelivery: "Yesterday, 03:15 PM",
        status: "active",
        createdAt: "Jun 2023",
    },
    {
        id: 4,
        name: "Westside — Baner",
        city: "Pune",
        address: "Shop 4, Balewadi High St, Baner, Pune 411045",
        managerName: "Kiran Sawant",
        managerPhone: "+91 87654 09876",
        managerEmail: "kiran.s@westside.com",
        publicTrackingSlug: "westside-baner",
        deliveriesToday: 1,
        totalDeliveries: 78,
        currentDevices: [],
        lastDelivery: "Today, 09:10 AM",
        status: "active",
        createdAt: "Sep 2023",
    },
    {
        id: 5,
        name: "Tanishq — Kothrud",
        city: "Pune",
        address: "Dahanukar Colony, Kothrud, Pune 411029",
        managerName: "Vijay Jadhav",
        managerPhone: "+91 93422 11234",
        managerEmail: "vijay.j@tanishq.com",
        publicTrackingSlug: "tanishq-kothrud",
        deliveriesToday: 0,
        totalDeliveries: 43,
        currentDevices: [],
        lastDelivery: "Mar 20, 11:00 AM",
        status: "inactive",
        createdAt: "Nov 2023",
    },
    {
        id: 6,
        name: "Zudio — Wakad",
        city: "Pune",
        address: "Spectrum Mall, Wakad, Pune 411057",
        managerName: "Meera Agarwal",
        managerPhone: "+91 98765 43210",
        managerEmail: "meera.a@zudio.com",
        publicTrackingSlug: "zudio-wakad",
        deliveriesToday: 0,
        totalDeliveries: 61,
        currentDevices: [],
        lastDelivery: "Mar 22, 02:30 PM",
        status: "active",
        createdAt: "Jan 2024",
    },
]

export default function StoresTable() {

    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="border rounded-lg">
                <DataTable
                    columns={columns}
                    data={stores}
                />
            </div>

        </section>
    )
}