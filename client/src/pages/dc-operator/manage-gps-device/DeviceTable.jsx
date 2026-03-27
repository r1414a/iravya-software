import { useState } from "react"
import DeviceDetailDrawer from "./DeviceDetailDrawer"
import { DataTable } from "./device-table/data-table"
import { columns } from "./device-table/columns"

const devices = [
    {
        id: 1,
        deviceId: "GPS-001-PUNE",
        imei: "354678901234560",
        simNo: "9833012345",
        firmware: "v2.4.1",
        assignedTruck: "MH12AB1234",
        assignedTruckType: "heavy",
        brand: "Tata Westside",
        status: "online",
        lastPing: "8s ago",
        lastPingDate: "Today, 10:42 AM",
        signalStrength: 87,
        battery: 92,
        totalTrips: 148,
        tripsThisMonth: 9,
        location: "Pune–Mumbai Expressway",
        installDate: "Jan 2023",
    },
    {
        id: 2,
        deviceId: "GPS-002-PUNE",
        imei: "354678901234561",
        simNo: "9833012346",
        firmware: "v2.4.1",
        assignedTruck: "MH14CD5678",
        assignedTruckType: "medium",
        brand: "Zudio",
        status: "online",
        lastPing: "12s ago",
        lastPingDate: "Today, 10:42 AM",
        signalStrength: 74,
        battery: 68,
        totalTrips: 87,
        tripsThisMonth: 5,
        location: "Hinjawadi Rd, Pune",
        installDate: "Jun 2023",
    },
    {
        id: 3,
        deviceId: "GPS-003-PUNE",
        imei: "354678901234562",
        simNo: "9833012347",
        firmware: "v2.3.8",
        assignedTruck: "MH12XY9090",
        assignedTruckType: "mini_truck",
        brand: "Tata Cliq",
        status: "offline",
        lastPing: "6h ago",
        lastPingDate: "Today, 04:15 AM",
        signalStrength: 0,
        battery: 41,
        totalTrips: 211,
        tripsThisMonth: 0,
        location: "Last: Mumbai Warehouse",
        installDate: "Feb 2022",
    },
    {
        id: 4,
        deviceId: "GPS-004-PUNE",
        imei: "354678901234563",
        simNo: "9833012348",
        firmware: "v2.4.0",
        assignedTruck: null,
        assignedTruckType: null,
        brand: null,
        status: "unassigned",
        lastPing: "Never",
        lastPingDate: "—",
        signalStrength: 0,
        battery: 100,
        totalTrips: 0,
        tripsThisMonth: 0,
        location: "—",
        installDate: "Mar 2026",
    },
    {
        id: 5,
        deviceId: "GPS-005-PUNE",
        imei: "354678901234564",
        simNo: "9833012349",
        firmware: "v2.4.1",
        assignedTruck: "MH04EF3344",
        assignedTruckType: "heavy",
        brand: "Tata Westside",
        status: "warning",
        lastPing: "4m ago",
        lastPingDate: "Today, 10:38 AM",
        signalStrength: 23,
        battery: 11,
        totalTrips: 57,
        tripsThisMonth: 4,
        location: "Baner, Pune",
        installDate: "Sep 2024",
    },
]

export default function DevicesTable() {
    const [selectedDevice, setSelectedDevice] = useState(null)

    return (
        <section className="mt-6 px-10">
            <div className="border rounded-lg">
                <DataTable
                    columns={columns}
                    data={devices}
                    onRowClick={(row) => setSelectedDevice(row)}
                />
            </div>

            <DeviceDetailDrawer
                device={selectedDevice}
                open={!!selectedDevice}
                onClose={() => setSelectedDevice(null)}
            />
        </section>
    )
}