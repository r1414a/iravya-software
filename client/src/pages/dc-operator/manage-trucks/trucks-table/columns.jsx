import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    MoreHorizontal,
    Pencil,
    UserRound,
    History,
    Wrench,
    SendHorizonal,
    ChevronRight,
} from "lucide-react"
 
// Truck type icon colours — a small coloured square instead of avatar initials
const typeColors = {
    mini_truck: "bg-teal-100 text-teal-700",
    medium:     "bg-amber-100 text-amber-700",
    heavy:      "bg-purple-100 text-purple-700",
}
 
const typeLabels = {
    mini_truck: "Mini",
    medium:     "Medium",
    heavy:      "Heavy",
}
 
// Status badge styles matching the three truck states
const statusStyles = {
    idle:        "bg-green-100 text-green-700",
    in_transit:  "bg-blue-100 text-blue-700",
    maintenance: "bg-amber-100 text-amber-700",
}
 
const statusLabels = {
    idle:        "Idle",
    in_transit:  "In transit",
    maintenance: "Maintenance",
}
 
export const columns = [
    // Truck reg no. + type badge
    {
        accessorKey: "regNo",
        header: "Truck",
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
    },
    // Driver name + phone
    {
        accessorKey: "driver",
        header: "Driver",
        cell: ({ row }) => {
            const { driverName, driverPhone } = row.original
            return driverName ? (
                <div className="-space-y-0.5">
                    <p className="text-sm font-medium">{driverName}</p>
                    <p className="text-xs text-gray-400">{driverPhone}</p>
                </div>
            ) : (
                <span className="text-xs text-gray-400 italic">No driver assigned</span>
            )
        },
    },
    // GPS device
    {
        accessorKey: "deviceId",
        header: "GPS device",
        cell: ({ row }) => {
            const { deviceId, deviceStatus } = row.original
            return deviceId ? (
                <div className="-space-y-0.5">
                    <p className="text-sm font-mono">{deviceId}</p>
                    <p className={`text-xs font-medium ${deviceStatus === "online" ? "text-green-600" : "text-gray-400"}`}>
                        {deviceStatus === "online" ? "● Online" : "○ Offline"}
                    </p>
                </div>
            ) : (
                <span className="text-gray-400 text-sm">—</span>
            )
        },
    },
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
        header: "Status",
        cell: ({ row }) => {
            const s = row.original.status
            return (
                <Badge className={`${statusStyles[s]} border-0 text-xs font-medium`}>
                    {statusLabels[s]}
                </Badge>
            )
        },
    },
    // Actions — idle trucks get a "Dispatch now" quick button; others get the 3-dot menu only
    {
        id: "actions",
        cell: ({ row }) => {
            const { status } = row.original
            return (
                <div className="flex items-center gap-2 justify-end">
                    {/* Dispatch now — only shown for idle trucks */}
                    {status === "idle" && (
                        <Button
                            size="sm"
                            className="bg-[#701a40] text-white h-7 px-3 text-xs flex items-center gap-1"
                            onClick={(e) => {
                                e.stopPropagation()
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
                        <DropdownMenuContent align="end" className="bg-white border shadow-md">
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                                <Pencil size={14} /> Edit truck details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                                <UserRound size={14} /> Change driver
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
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
            )
        },
    },
]