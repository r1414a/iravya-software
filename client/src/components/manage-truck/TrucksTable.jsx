import { useState } from "react"
import { DataTable } from "./trucks-table/data-table"
import { columns } from "./trucks-table/columns"

const trucks = [
    {
        id: 1,
        regNo: "MH12AB1234",
        type: "heavy",
        make: "Tata 407",
        capacity: "4T",
        // driverName: "Ravi Deshmukh",
        // driverPhone: "+91 98201 11234",
        // deviceId: "GPS-001-PUNE",
        // deviceStatus: "online",
        totalTrips: 142,
        tripsThisMonth: 9,
        lastTrip: "2h ago",
        lastTripDate: "Today, 09:14 AM",
        status: "in_transit",
    },
    {
        id: 2,
        regNo: "MH14CD5678",
        type: "medium",
        make: "Ashok Leyland",
        capacity: "2.5T",
        // driverName: "Suresh Pawar",
        // driverPhone: "+91 99705 44321",
        // deviceId: "GPS-002-PUNE",
        // deviceStatus: "online",
        totalTrips: 87,
        tripsThisMonth: 5,
        lastTrip: "Yesterday",
        lastTripDate: "Mar 24, 05:30 PM",
        status: "idle",
    },
    {
        id: 3,
        regNo: "MH12XY9090",
        type: "mini_truck",
        make: "Mahindra Bolero",
        capacity: "1T",
        // driverName: "Manoj Kale",
        // driverPhone: "+91 87654 32109",
        // deviceId: "GPS-003-PUNE",
        // deviceStatus: "offline",
        totalTrips: 210,
        tripsThisMonth: 0,
        lastTrip: "2 weeks ago",
        lastTripDate: "Mar 11, 08:00 AM",
        status: "maintenance",
    },
    {
        id: 4,
        regNo: "MH04EF3344",
        type: "heavy",
        make: "Tata Prima",
        capacity: "6T",
        // driverName: "Vijay Jadhav",
        // driverPhone: "+91 93422 65432",
        // deviceId: "GPS-004-PUNE",
        // deviceStatus: "online",
        totalTrips: 12,
        tripsThisMonth: 4,
        lastTrip: "3 days ago",
        lastTripDate: "Mar 22, 01:10 PM",
        status: "idle",
    },
    {
        id: 5,
        regNo: "MH20GH7788",
        type: "medium",
        make: "Eicher Pro",
        capacity: "3T",
        // driverName: null,
        // driverPhone: null,
        // deviceId: "GPS-005-PUNE",
        // deviceStatus: "offline",
        totalTrips: 56,
        tripsThisMonth: 2,
        lastTrip: "5 days ago",
        lastTripDate: "Mar 20, 11:30 AM",
        status: "idle",
    },
]

export default function TrucksTable({ 
    trucks,
    setEditTruck,
    setEditOpen,
    setTruckHistory,
    setTruckHistoryOpen,
    setCurrentTrip,
    setCurrentTripOpen,
    setDispatchTruck,
    setDispatchTruckOpen,
    setPage,
    columnFilters,
    setColumnFilters,
    totalPages,
    page,
    onPrevious,
    onNext,
    isFetching
}) {

    const meta = useMemo(() => ({
        setEditTruck,
        setEditOpen,
        setTruckHistory,
        setTruckHistoryOpen,
        setCurrentTrip,
        setCurrentTripOpen,
        setDispatchTruck,
    setDispatchTruckOpen,
    }), [
        setEditTruck, 
        setEditOpen, 
        setTruckHistory,
        setTruckHistoryOpen,
        setCurrentTrip,
        setCurrentTripOpen,
        setDispatchTruck,
    setDispatchTruckOpen,
    ])

    return (
        <section className="mt-6 px-4 lg:px-10">
            <div className="border rounded-lg">
                <DataTable
                    columns={columns}
                    data={trucks}
                    meta={meta}
                    setPage={setPage}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    totalPages={totalPages}
                    page={page}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    isFetching={isFetching}
                />
            </div>

        </section>
    )
}