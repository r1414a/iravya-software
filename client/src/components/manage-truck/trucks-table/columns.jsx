import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MoreHorizontal,
    Pencil,
    UserRound,
    History,
    Wrench,
    SendHorizonal,
    ChevronRight,
    Filter,
    Road,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Checkbox } from "@/components/ui/checkbox"
// import { FieldLabel } from "@/components/ui/field"
import { useState } from "react"
import CreateTripModal from "../../manage-trip/CreateNewTrip"
import TruckDetailDrawer from "../TruckDetailDrawer"
import AddTruckModal from "../AddTruckForm"
import TripDetailSheet from "@/components/manage-trip/TripDetailSheet"
import { useLocation } from "react-router-dom"


// Truck type icon colours — a small coloured square instead of avatar initials
// const typeColors = {
//     mini_truck: "bg-teal-100 text-teal-700",
//     medium: "bg-amber-100 text-amber-700",
//     heavy: "bg-purple-100 text-purple-700",
// }

const typeLabels = {
    mini_truck: "Mini",
    medium: "Medium",
    heavy: "Heavy",
}

// Status badge styles matching the three truck states
const statusStyles = {
    idle: "bg-green-100 text-green-700",
    in_transit: "bg-blue-100 text-blue-700",
    maintenance: "bg-amber-100 text-amber-700",
}

const statusLabels = {
    idle: "Idle",
    in_transit: "In transit",
    maintenance: "Maintenance",
}

function ActionsCell({ row }) {
    const truck = row.original
    const [editOpen, setEditOpen] = useState(false)
    const [tripHistory, setTripHistory] = useState(false)
    const [openDispatch, setOpenDispatch] = useState(false)
    const [tripDetailsOpen, setTripDetailsOpen] = useState(false)
    const location = useLocation();
    // console.log(location.pathname);
    
    
    return (
        <>
            <AddTruckModal
                truck={truck}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />

            <CreateTripModal
                truck={truck}
                open={openDispatch}
                onClose={() => setOpenDispatch(false)}
            />

            <TruckDetailDrawer
                truck={truck}
                open={tripHistory}
                onClose={() => setTripHistory(false)}
            />

            {/* Will need to fetch trip details by truck id by api call */}
            <TripDetailSheet
                trip={{
                    id: "TRP-2840",
                    brand: "Zudio",
                    truck: "MH14CD5678",
                    driver: "Suresh M.",
                    sourceDC: "Mumbai Warehouse DC",
                    stops: [
                        { name: "Hinjawadi Store", status: "pending" },
                    ],
                    stopsCount: 1,
                    status: "in_transit",
                    departedAt: "Today, 08:15 AM",
                    eta: "Today, 10:30 AM",
                    completedAt: null,
                }}
                open={tripDetailsOpen}
                onClose={setTripDetailsOpen}
            />
            <div className="flex items-center gap-2 justify-end">
                {/* Dispatch now — only shown for idle trucks */}
                {truck.status === "idle" && location.pathname.startsWith('/dc') && (
                    <Button
                        size="sm"
                        className="bg-maroon text-white h-7 px-3 text-xs flex items-center gap-1"
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpenDispatch(true)
                            // navigate to /dc/dispatch?truck=regNo
                        }}
                    >
                        <SendHorizonal size={12} />
                        Dispatch
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="gap-2 text-sm cursor-pointer">
                            <Pencil size={14} /> Edit truck details
                        </DropdownMenuItem>
                        {truck.status === "in_transit" && (
                            <DropdownMenuItem onClick={() => setTripDetailsOpen(true)} className="gap-2 text-sm cursor-pointer">
                                <Road size={14} /> View trip details
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setTripHistory(true)} className="gap-2 text-sm cursor-pointer">
                            <History size={14} /> View trip history
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                            <Wrench size={14} /> Mark as maintenance
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Row arrow — clicking the row opens the detail drawer */}
                <ChevronRight size={16} className="text-gray-300" />
            </div>
        </>
    )
}

export const columns = [
    // Truck reg no. + type badge
    {
        accessorKey: "type",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Truck</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue === "all"
                                    ? "All classes"
                                    : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
                            </Button>
                            {/* <Filter size={16} fill="#701a40" stroke=" #701a40" /> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={currentValue}
                                onValueChange={(value) => {
                                    column.setFilterValue(
                                        value === "all" ? undefined : value
                                    )
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="mini_truck" className="text-xs">
                                    Mini
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="medium" className="text-xs">
                                    Medium
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="heavy" className="text-xs">
                                    Heavy
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const { regNo, type } = row.original
            return (
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg flex items-center justify-center text-xs font-bold p-1 bg-gold text-maroon`}>
                        {typeLabels[type]}
                    </div>
                    <div className="-space-y-0.5">
                        <p className="font-semibold text-sm font-mono">{regNo}</p>
                        <p className="text-xs text-gray-400">{row.original.make} · {row.original.capacity}</p>
                    </div>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        }
    },
    // Driver name + phone
    // {
    //     accessorKey: "driverName",
    //     header: ({ column }) => {
    //         const currentValue = column.getFilterValue() || "all"
    //         const isChecked = currentValue === "unassigned"

    //         return (
    //             <div className="flex items-center gap-2">
    //                 <span>Truck</span>

    //                 <Checkbox
    //                     id="terms-checkbox-basic"
    //                     name="terms-checkbox-basic"
    //                     className="w-3 h-3 rounded-xs -mr-1 border border-gray-500"
    //                     checked={isChecked}
    //                     onCheckedChange={(checked) => {
    //                         column.setFilterValue(
    //                             checked ? "unassigned" : undefined
    //                         )
    //                     }}
    //                 />
    //                 <FieldLabel htmlFor="terms-checkbox-basic" className="text-xs">
    //                     Unassigned only
    //                 </FieldLabel>
    //             </div>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const { driverName, driverPhone } = row.original
    //         return driverName ? (
    //             <div className="-space-y-0.5">
    //                 <p className="text-sm font-medium">{driverName}</p>
    //                 <p className="text-xs text-gray-400">{driverPhone}</p>
    //             </div>
    //         ) : (
    //             <span className="text-xs text-gray-400 italic">No driver assigned</span>
    //         )
    //     },
    //     filterFn: (row, id, value) => {
    //         if (!value) return true

    //         const driverName = row.getValue(id)

    //         // ✅ show only rows with NO driver
    //         return !driverName
    //     },
    // },
    // GPS device
    // {
    //     accessorKey: "deviceId",
    //     header: "GPS device",
    //     cell: ({ row }) => {
    //         const { deviceId, deviceStatus } = row.original
    //         return deviceId ? (
    //             <div className="-space-y-0.5">
    //                 <p className="text-sm font-mono">{deviceId}</p>
    //                 <p className={`text-xs font-medium ${deviceStatus === "online" ? "text-green-600" : "text-gray-400"}`}>
    //                     {deviceStatus === "online" ? "● Online" : "○ Offline"}
    //                 </p>
    //             </div>
    //         ) : (
    //             <span className="text-gray-400 text-sm">—</span>
    //         )
    //     },
    // },
    // Trip stats
    {
        accessorKey: "trips",
        header: "Trips",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm font-medium">{row.original.totalTrips} total</p>
                <p className="text-xs text-gray-400">{row.original.tripsThisMonth} this month</p>
            </div>
        ),
    },
    // Last trip date
    {
        accessorKey: "lastTrip",
        header: "Last trip",
        cell: ({ row }) => (
            <div className="-space-y-0.5">
                <p className="text-sm">{row.original.lastTrip}</p>
                <p className="text-xs text-gray-400">{row.original.lastTripDate}</p>
            </div>
        ),
    },
    // Status badge
    {
        accessorKey: "status",
        header: ({ column }) => {
            const currentValue = column.getFilterValue() || "all"
            return (
                <div className="flex items-center gap-2">
                    <span>Status</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                                {currentValue === "all"
                                    ? "All"
                                    : currentValue === "in_transit"
                                        ? "In transit"
                                        : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
                            </Button>
                            {/* <Filter size={16} fill="#701a40" stroke=" #701a40" /> */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 bg-white border shadow-md">
                            <DropdownMenuRadioGroup
                                value={currentValue}
                                onValueChange={(value) => {
                                    column.setFilterValue(
                                        value === "all" ? undefined : value
                                    )
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="text-xs">
                                    All
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="idle" className="text-xs">
                                    Idle
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="in_transit" className="text-xs">
                                    In transit
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="maintenance" className="text-xs">
                                    Maintenance
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        cell: ({ row }) => {
            const s = row.original.status
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {statusLabels[s]}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true
            return row.getValue(id) === value
        }
    },
    // Actions — idle trucks get a "Dispatch now" quick button; others get the 3-dot menu only
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell row={row} />,
    },

    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const { status } = row.original
    //         return (
    //             <div className="flex items-center gap-2 justify-end">
    //                 {/* Dispatch now — only shown for idle trucks */}
    //                 {status === "idle" && (
    //                     <Button
    //                         size="sm"
    //                         className="bg-maroon text-white h-7 px-3 text-xs flex items-center gap-1"
    //                         onClick={(e) => {
    //                             e.stopPropagation()
    //                             // navigate to /dc/dispatch?truck=regNo
    //                         }}
    //                     >
    //                         <SendHorizonal size={12} />
    //                         Dispatch
    //                     </Button>
    //                 )}

    //                 <DropdownMenu>
    //                     <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" size="icon" className="h-8 w-8">
    //                             <MoreHorizontal size={16} />
    //                         </Button>
    //                     </DropdownMenuTrigger>
    //                     <DropdownMenuContent align="end" className="bg-white border shadow-md w-40">
    //                         <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
    //                             <Pencil size={14} /> Edit truck details
    //                         </DropdownMenuItem>
    //                         {/* <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
    //                             <UserRound size={14} /> Change driver
    //                         </DropdownMenuItem> */}
    //                         <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
    //                             <History size={14} /> View trip history
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
    //                             <Wrench size={14} /> Mark as maintenance
    //                         </DropdownMenuItem>
    //                     </DropdownMenuContent>
    //                 </DropdownMenu>

    //                 {/* Row arrow — clicking the row opens the detail drawer */}
    //                 <ChevronRight size={16} className="text-gray-300" />
    //             </div>
    //         )
    //     },
    // },
]